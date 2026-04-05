1.3  User Roles & Access Matrix
Role	Customers	Loans	Payments	Accounting	Approvals	Admin
Director	Full	Full + Approve	Full	Full	Execute	Full
MD	Full	Full + Approve	Full	Full	Execute	Full
Accountant	Read/Write	Read/Write	Record	Full	Submit	None
Secretary	Read/Write	Read + Apply	Read	None	Submit	None
Admin	Read	Read	Read	Read	None	Full
Developer	Full	Full	Full	Full	Full	Full


1.5  Global Request & Response Conventions
Content-Type: application/json
All timestamps are ISO 8601 UTC.  All monetary values are integers (kobo/cents).  Pagination uses cursor-based paging.
Standard Success Envelope:
{
  "success": true,
  "data":    { ... },
  "meta":    { "page": 1, "perPage": 25, "total": 142, "cursor": "..." }
}
Standard Error Envelope:
{
  "success": false,
  "error": {
    "code":    "LOAN_NOT_FOUND",
    "message": "No loan with the given identifier exists.",
    "details": [ { "field": "loanId", "issue": "not found" } ]
  }
}

1.6  HTTP Status Code Standards
Field	Type	Req.	Description
200 OK	Success	—	Standard success for GET, PUT, PATCH
201 Created	Success	—	Resource created successfully (POST)
204 No Content	Success	—	Successful DELETE with no response body
400 Bad Request	Client Error	—	Validation failure; details array enumerates field-level errors
401 Unauthorized	Client Error	—	Missing or invalid JWT
403 Forbidden	Client Error	—	Valid JWT but insufficient role permissions
404 Not Found	Client Error	—	Resource does not exist
409 Conflict	Client Error	—	Duplicate record or state conflict (e.g., loan already settled)
422 Unprocessable	Client Error	—	Business rule violation (e.g., payment exceeds outstanding)
500 Server Error	Server Error	—	Unexpected internal error; engineers should be alerted
 
2. Authentication & Session Management
All endpoints (except /auth/login and /auth/refresh) require a Bearer token in the Authorization header. Tokens expire after 8 hours; refresh tokens are valid for 30 days.
2.1  Endpoints
POST /auth/login
 POST 	/auth/login
Authenticate a user with email/username and password. Returns access and refresh tokens.
Request Body
Field	Type	Req.	Description
identifier	string	✓	Email address or username
password	string	✓	Plain-text password (transmitted over HTTPS only)
deviceInfo	object	—	Optional: { userAgent, ipAddress, deviceId } for audit logging
Response
Field	Type	Description
accessToken	string	JWT; expires in 8h
refreshToken	string	Opaque token; expires in 30 days
expiresAt	ISO8601	Access token expiry timestamp
user	UserObject	id, username, email, role, fullName, permissions[]
Notes: Passwords are bcrypt-hashed (cost ≥ 12). Failed attempts are rate-limited: 5 attempts per 15 minutes per IP.



POST /auth/refresh
 POST 	/auth/refresh
Issue a new access token using a valid refresh token. Does not require Authorization header.
Request Body
Field	Type	Req.	Description
refreshToken	string	✓	Refresh token issued at login
Response
Field	Type	Description
accessToken	string	New JWT
expiresAt	ISO8601	Expiry of new token



POST /auth/logout
 POST 	/auth/logout
Invalidate the refresh token server-side. Access token will still be valid until expiry (stateless).
Request Body
Field	Type	Req.	Description
refreshToken	string	✓	Token to revoke
Response
Field	Type	Description
success	boolean	Always true on valid call



POST /auth/change-password
 POST 	/auth/change-password
Authenticated user changes their own password.
Request Body
Field	Type	Req.	Description
currentPassword	string	✓	Existing password for verification
newPassword	string	✓	Must be min 8 chars, 1 uppercase, 1 digit
Response
Field	Type	Description
success	boolean	true on successful change



POST /auth/reset-password/request
 POST 	/auth/reset-password/request
Initiate a password reset flow. Sends OTP or reset link to registered email.
Request Body
Field	Type	Req.	Description
email	string	✓	Registered email address
Response
Field	Type	Description
message	string	Always returns success message to prevent email enumeration



POST /auth/reset-password/confirm
 POST 	/auth/reset-password/confirm
Complete password reset with the OTP or token received via email.
Request Body
Field	Type	Req.	Description
token	string	✓	Reset token from email
newPassword	string	✓	New password meeting complexity requirements
Response
Field	Type	Description
success	boolean	true on successful reset



2.2  JWT Payload Structure
{
  "sub":         "usr_01HXYZ...",   // user ID
  "role":        "Accountant",
  "permissions": ["loans:read", "payments:write", "ledger:read"],
  "iat":         1716000000,
  "exp":         1716028800
}
 
3. User Management
User management endpoints are restricted to Director, MD, and Developer roles. All mutations go through the approval workflow for privileged role changes.
3.1  Endpoints
GET /users
 GET 	/users
List all system users with optional filtering.
Request Body
Field	Type	Req.	Description
role	string	—	Filter by role: Director | MD | Accountant | Secretary | Admin | Developer
status	string	—	active | inactive | suspended
search	string	—	Full-text search on name or email
page	integer	—	Pagination cursor
Response
Field	Type	Description
users	User[]	Array of user objects
meta	PaginationMeta	total, page, perPage, cursor



GET /users/:id
 GET 	/users/:id
Retrieve a single user by ID.
Response
Field	Type	Description
id	string	Unique user identifier
username	string	Login username
email	string	Email address
fullName	string	Display name
role	UserRole	Assigned role
status	string	active | inactive | suspended
lastLogin	ISO8601	Last successful login timestamp
createdAt	ISO8601	Account creation date



POST /users
 POST 	/users
Create a new system user. Sends welcome email with temporary password.
Request Body
Field	Type	Req.	Description
fullName	string	✓	Display name
email	string	✓	Must be unique
username	string	✓	Must be unique; alphanumeric
role	UserRole	✓	Director | MD | Accountant | Secretary | Admin | Developer
phone	string	—	Contact phone
Response
Field	Type	Description
user	User	Created user object; password is not returned



PUT /users/:id
 PUT 	/users/:id
Update user profile fields. Role changes require Director/MD approval.
Request Body
Field	Type	Req.	Description
fullName	string	—	Updated display name
email	string	—	Updated email
role	UserRole	—	Role change — creates approval request
status	string	—	active | inactive | suspended
Response
Field	Type	Description
user	User	Updated user or pending approval reference



DELETE /users/:id
 DELETE 	/users/:id
Deactivate user account. Does not hard-delete; sets status to inactive.
Response
Field	Type	Description
success	boolean	true on deactivation



GET /users/:id/activity-log
 GET 	/users/:id/activity-log
Retrieve audit trail of actions performed by a specific user.
Request Body
Field	Type	Req.	Description
from	date	—	Start date filter
to	date	—	End date filter
action	string	—	Filter by action type
Response
Field	Type	Description
logs	ActivityLog[]	id, userId, action, entityType, entityId, payload, timestamp, ipAddress



 
4. Customer Management
Customers are the borrowers whose profile anchors every loan. The customer record maintains KYC data, employment information, next-of-kin details, and a complete loan history.
4.1  Customer Object
Field	Type	Description
id	string	Unique customer identifier (cust_...)
customerNumber	string	Human-readable sequential reference (e.g., CUST-00124)
title	string	Mr | Mrs | Miss | Dr | Prof
firstName	string	First name
lastName	string	Last name
middleName	string	Optional middle name
dateOfBirth	date	ISO 8601 date
gender	string	Male | Female | Other
email	string	Contact email
phone	string	Primary phone number
altPhone	string	Alternate phone number
address	string	Residential address
state	string	Nigerian state of residence
lga	string	Local Government Area
bvn	string	Bank Verification Number (masked after storage)
nin	string	National Identity Number (masked)
employmentStatus	string	Employed | Self-Employed | Unemployed | Retired
employer	string	Employer name (if employed)
employerAddress	string	Employer address
monthlyIncome	integer	Monthly net income in kobo
bankName	string	Customer bank name
accountNumber	string	Bank account number (masked)
accountName	string	Bank account name
nextOfKin	NextOfKin	name, relationship, phone, address
documents	Document[]	KYC document references (type, url, uploadedAt, verified)
status	string	Active | Blacklisted | Deceased
riskScore	integer	Internal credit risk score 0–100
totalLoans	integer	Count of all loans ever taken
activeLoans	integer	Count of currently active loans
createdAt	ISO8601	Record creation timestamp
updatedAt	ISO8601	Last update timestamp

4.2  Endpoints
GET /customers
 GET 	/customers
Paginated list of all customers with filtering and search.
Request Body
Field	Type	Req.	Description
search	string	—	Full-text across name, email, phone, customerNumber
status	string	—	Active | Blacklisted | Deceased
state	string	—	Nigerian state filter
hasActiveLoans	boolean	—	Filter to customers with active loans only
page	integer	—	Page number (default 1)
perPage	integer	—	Records per page (default 25, max 100)
sortBy	string	—	firstName | lastName | createdAt | riskScore
sortDir	string	—	asc | desc
Response
Field	Type	Description
customers	Customer[]	Array of customer objects
meta	PaginationMeta	Pagination metadata



POST /customers
 POST 	/customers
Create a new customer record. Triggers approval workflow if configured.
Request Body
Field	Type	Req.	Description
firstName	string	✓	First name
lastName	string	✓	Last name
dateOfBirth	date	✓	ISO date — must be ≥ 18 years ago
phone	string	✓	Nigerian phone number, validated format
bvn	string	✓	11-digit BVN
email	string	—	Email address
address	string	✓	Residential address
employmentStatus	string	✓	Employment category
monthlyIncome	integer	✓	Net income in kobo
bankName	string	✓	Bank name
accountNumber	string	✓	10-digit NUBAN account
nextOfKin	object	✓	{ name, relationship, phone, address }
Response
Field	Type	Description
customer	Customer	Created customer object



GET /customers/:id
 GET 	/customers/:id
Retrieve full customer profile.
Response
Field	Type	Description
customer	Customer	Full customer object including all nested fields



PUT /customers/:id
 PUT 	/customers/:id
Update customer record. Creates approval entry for sensitive field changes.
Request Body
Field	Type	Req.	Description
Any Customer field	mixed	—	Any updatable customer field; BVN/NIN changes always trigger approval
Response
Field	Type	Description
customer	Customer	Updated customer or pending approval reference



GET /customers/:id/loans
 GET 	/customers/:id/loans
Get all loans for a specific customer.
Response
Field	Type	Description
loans	Loan[]	Array of loan summary objects for this customer



GET /customers/:id/payments
 GET 	/customers/:id/payments
Get full payment history for a customer across all loans.
Response
Field	Type	Description
payments	Payment[]	Array of payment records



GET /customers/:id/statements
 GET 	/customers/:id/statements
Generate an account statement for a customer. Returns JSON or triggers PDF download.
Request Body
Field	Type	Req.	Description
from	date	—	Statement start date
to	date	—	Statement end date (defaults to today)
format	string	—	json (default) | pdf
Response
Field	Type	Description
customer	CustomerSummary	Identifying customer info
period	object	{ from, to }
transactions	Transaction[]	Chronological list of loan and payment events
summary	object	{ totalBorrowed, totalRepaid, outstanding }
Notes: For format=pdf the response is a binary stream with Content-Type: application/pdf.



POST /customers/:id/documents
 POST 	/customers/:id/documents
Upload a KYC document for a customer. Accepts multipart/form-data.
Request Body
Field	Type	Req.	Description
documentType	string	✓	NIN | BVN | Passport | DriverLicense | UtilityBill | BankStatement | EmploymentLetter
file	File	✓	Binary file upload (JPEG, PNG, PDF; max 5 MB)
expiryDate	date	—	Document expiry date if applicable
Response
Field	Type	Description
document	Document	id, type, url, uploadedAt, verified: false



PATCH /customers/:id/blacklist
 PATCH 	/customers/:id/blacklist
Blacklist or un-blacklist a customer. Blacklisted customers cannot receive new loans.
Request Body
Field	Type	Req.	Description
blacklisted	boolean	✓	true to blacklist, false to remove
reason	string	✓	Mandatory reason for audit trail
Response
Field	Type	Description
customer	Customer	Updated customer with new status



 
5. Loan Origination & Management
The loan module covers the complete origination lifecycle: loan application, term calculation, approval workflow, disbursement, and ongoing management. The amortization engine uses standard annuity formulas (PMT/IPMT/PPMT) and rounds to the nearest ₦10 unit.
5.1  Loan Object
Field	Type	Description
id	string	Unique loan identifier (loan_...)
loanNumber	string	Human-readable reference (e.g., LN-2024-00456)
customerId	string	FK to customer
customerName	string	Denormalized for display
loanAmount	integer	Original principal in kobo
managementFeeRate	decimal	Fee % (default 5.5)
managementFeeAmount	integer	Computed fee in kobo
deductFeeUpfront	boolean	If true, fee deducted from disbursement; if false, spread across installments
totalDisbursed	integer	Amount actually transferred to customer in kobo
interestRate	decimal	Monthly interest rate as %
numberOfInstalments	integer	Total number of repayment periods
monthlyPayment	integer	Fixed PMT amount in kobo
totalInterest	integer	Total interest payable over loan term
totalManagementFees	integer	Total management fees over term
totalPayment	integer	Grand total repayment amount
disbursementDate	date	Date loan was disbursed
firstPaymentDate	date	Date of first installment due
maturityDate	date	Date of final installment
purpose	string	Loan purpose stated by customer
loanStatus	LoanStatus	Pending | Active | Overdue | Settled | Rejected | Written-Off
disbursementMethod	string	BankTransfer | Cash | Cheque
bankName	string	Disbursement bank
accountNumber	string	Disbursement account
principalOutstanding	integer	Remaining principal balance
interestOutstanding	integer	Accrued unpaid interest
totalOutstanding	integer	Total amount still owed
totalPaid	integer	Cumulative amount received
daysOverdue	integer	Number of days the oldest unpaid installment is overdue
createdBy	string	User ID who created the loan record
approvedBy	string	User ID who executed the approval
approvedAt	ISO8601	Approval timestamp
instalments	Instalment[]	Full amortization schedule (only returned in detail endpoint)
createdAt	ISO8601	Record creation timestamp

5.2  Loan Endpoints
GET /loans
 GET 	/loans
Paginated list of all loans with comprehensive filtering.
Request Body
Field	Type	Req.	Description
status	string	—	Pending | Active | Overdue | Settled | Rejected | Written-Off
customerId	string	—	Filter by customer
search	string	—	Search by loanNumber or customerName
from	date	—	Disbursement date from
to	date	—	Disbursement date to
overdue	boolean	—	true returns only overdue loans
minAmount	integer	—	Minimum loan amount in kobo
maxAmount	integer	—	Maximum loan amount in kobo
page	integer	—	Page number
perPage	integer	—	Page size (default 25)
sortBy	string	—	disbursementDate | loanAmount | daysOverdue | createdAt
sortDir	string	—	asc | desc
Response
Field	Type	Description
loans	Loan[]	Array of loan summary objects (no instalment schedule)
aggregates	object	{ totalPortfolioValue, totalOutstanding, overdueCount, activeCount }
meta	PaginationMeta	Pagination metadata



POST /loans
 POST 	/loans
Create a new loan application. This creates the record and submits it for approval; the installment schedule is generated upon approval execution.
Request Body
Field	Type	Req.	Description
customerId	string	✓	Customer receiving the loan
loanAmount	integer	✓	Principal amount in kobo (must be multiple of 1000)
interestRate	decimal	✓	Monthly interest rate % (e.g., 3.0 = 3%)
numberOfInstalments	integer	✓	Repayment periods (1–60)
managementFeeRate	decimal	—	Defaults to 5.5 if omitted
deductFeeUpfront	boolean	✓	Fee handling method
disbursementDate	date	✓	Planned disbursement date
firstPaymentDate	date	✓	First installment due date
purpose	string	—	Customer-stated loan purpose
disbursementMethod	string	✓	BankTransfer | Cash | Cheque
bankName	string	—	Required if disbursementMethod = BankTransfer
accountNumber	string	—	Required if disbursementMethod = BankTransfer
topUp	boolean	—	true if this is a top-up on an existing active loan
topUpLoanId	string	—	Required if topUp = true; existing loan to refinance
Response
Field	Type	Description
loan	Loan	Created loan object with status: Pending
approvalId	string	Approval request ID awaiting Director/MD action
previewSchedule	Instalment[]	Provisional amortization schedule for display (not yet persisted)
Notes: Loan creation always produces an approval entry. The instalment schedule is persisted only when the approval is executed.



GET /loans/:id
 GET 	/loans/:id
Retrieve full loan detail including complete instalment schedule and payment history.
Response
Field	Type	Description
loan	Loan	Full loan object including instalments[] and payments[]



PUT /loans/:id
 PUT 	/loans/:id
Modify an existing loan (only allowed while status = Pending or with special Director override for Active loans). Creates an approval record.
Request Body
Field	Type	Req.	Description
loanAmount	integer	—	Modified principal
interestRate	decimal	—	Modified rate
numberOfInstalments	integer	—	Modified term
disbursementDate	date	—	Modified disbursement date
reason	string	✓	Mandatory change justification for audit trail
Response
Field	Type	Description
approvalId	string	Approval request created; loan not yet modified



DELETE /loans/:id
 DELETE 	/loans/:id
Mark a Pending loan as Rejected/Deleted. Cannot delete Active or Settled loans.
Request Body
Field	Type	Req.	Description
reason	string	✓	Rejection reason
Response
Field	Type	Description
success	boolean	true on successful rejection



POST /loans/calculate
 POST 	/loans/calculate
Preview loan terms and generate an amortization schedule without persisting any records. Used by the Add Loan form for live calculations.
Request Body
Field	Type	Req.	Description
loanAmount	integer	✓	Principal in kobo
interestRate	decimal	✓	Monthly rate %
numberOfInstalments	integer	✓	Term length
managementFeeRate	decimal	—	Defaults to 5.5
deductFeeUpfront	boolean	✓	Fee deduction method
disbursementDate	date	✓	Start date for schedule generation
firstPaymentDate	date	✓	First due date
Response
Field	Type	Description
monthlyPayment	integer	Fixed PMT in kobo
totalInterest	integer	Total interest over term
totalManagementFees	integer	Total fees over term
totalPayment	integer	Grand total repayment
totalDisbursed	integer	Amount customer actually receives
schedule	Instalment[]	Full provisional amortization table



PATCH /loans/:id/write-off
 PATCH 	/loans/:id/write-off
Write off a non-performing loan. Moves balance from loan asset to bad debt expense in the ledger.
Request Body
Field	Type	Req.	Description
reason	string	✓	Write-off justification
writeOffDate	date	✓	Effective date for accounting entry
Response
Field	Type	Description
loan	Loan	Updated loan with status: Written-Off
journalEntryId	string	Corresponding ledger journal reference



GET /loans/:id/schedule
 GET 	/loans/:id/schedule
Return only the amortization schedule for a loan (lightweight alternative to full detail).
Response
Field	Type	Description
instalments	Instalment[]	Full schedule array



GET /loans/:id/schedule/export
 GET 	/loans/:id/schedule/export
Export amortization schedule as PDF or Excel.
Request Body
Field	Type	Req.	Description
format	string	✓	pdf | xlsx
Response
Field	Type	Description
—	Binary stream	File download with appropriate Content-Type and Content-Disposition headers



POST /loans/:id/recalculate
 POST 	/loans/:id/recalculate
Trigger a schedule recalculation and portfolio sync. Used after data corrections or prepayments.
Response
Field	Type	Description
loan	Loan	Refreshed loan with updated outstanding amounts
instalments	Instalment[]	Rebuilt amortization schedule



5.3  Instalment Object
Field	Type	Description
id	string	Instalment record ID
loanId	string	Parent loan ID
instalmentNumber	integer	Period number (1 to n)
dueDate	date	Payment due date
openingBalance	integer	Principal balance at period start (kobo)
closingBalance	integer	Principal balance at period end (kobo)
principalAmount	integer	Principal component of scheduled payment
interestAmount	integer	Interest component of scheduled payment
managementFee	integer	Management fee for this period
totalPayment	integer	Total scheduled payment (principal + interest + fee)
paidAmount	integer	Actual amount paid toward this instalment
principalPaid	integer	Principal portion of actual payments received
interestPaid	integer	Interest portion of actual payments received
managementFeePaid	integer	Fee portion of actual payments received
balanceRemaining	integer	Outstanding amount for this instalment
status	string	Pending | Paid | PartiallyPaid | Overdue | Waived
paymentDate	date	Date payment was actually received (null if unpaid)
daysOverdue	integer	Days past due date (0 if not overdue)
penaltyAmount	integer	Penalty charged for overdue
penaltyPaid	integer	Penalty amount collected
 
6. Payment Capture & Allocation
The payment module records all repayment receipts, allocates amounts to principal, interest, management fees, and penalties, and maintains real-time outstanding balances. It supports regular installment payments, prepayments (early payoff), and payment reversals.
6.1  Payment Object
Field	Type	Description
id	string	Payment record ID (pay_...)
loanId	string	Parent loan ID
loanInstalmentId	string	Instalment this payment is allocated to
customerId	string	Customer FK
paymentDate	date	Date payment was received
paymentAmount	integer	Total receipt amount in kobo
principalAmount	integer	Allocated to principal
interestAmount	integer	Allocated to interest
monitoringFee	integer	Allocated to management/monitoring fee
penalties	integer	Allocated to penalty charges
paymentMethod	string	Cash | BankTransfer | Cheque | POS | USSD | Mobile
referenceNumber	string	Bank reference or receipt number
paymentEvidence	string	URL to uploaded receipt/evidence file
isPrepayment	boolean	True if payment covers future installments
prepaymentScope	string	Current | Full | Partial — prepayment coverage type
recordedBy	string	User ID who recorded the payment
reversedAt	ISO8601	If payment was reversed, timestamp of reversal
reversalReason	string	Reason for reversal if applicable
createdAt	ISO8601	Record creation timestamp

6.2  Endpoints
POST /payments
 POST 	/payments
Record a new payment. The system automatically allocates the amount to interest, fees, penalties, then principal in that priority order.
Request Body
Field	Type	Req.	Description
loanId	string	✓	Loan receiving the payment
loanInstalmentId	string	✓	Specific instalment being paid (use current due instalment)
paymentDate	date	✓	Date of receipt
paymentAmount	integer	✓	Total received in kobo
principalAmount	integer	✓	Explicit principal allocation
interestAmount	integer	✓	Explicit interest allocation
monitoringFee	integer	—	Fee allocation (0 if already paid/waived)
penalties	integer	—	Penalty allocation
paymentMethod	string	✓	Payment channel
referenceNumber	string	—	Bank/POS reference
isPrepayment	boolean	—	Set true for early repayment
prepaymentScope	string	—	Required if isPrepayment=true: Full | Partial
paymentEvidence	File	—	Receipt image or bank debit advice (multipart)
Response
Field	Type	Description
payment	Payment	Created payment record
updatedLoan	Loan	Loan object with refreshed outstanding balances
updatedInstalment	Instalment	Instalment with updated paid amounts and status
ledgerEntries	LedgerEntry[]	Accounting entries posted for this payment
Notes: Validation: paymentAmount must equal sum of component allocations. Total allocations cannot exceed instalment balance remaining.



GET /payments
 GET 	/payments
Paginated list of all payment records with filters.
Request Body
Field	Type	Req.	Description
loanId	string	—	Filter by loan
customerId	string	—	Filter by customer
from	date	—	Payment date from
to	date	—	Payment date to
method	string	—	Payment method filter
page	integer	—	Page number
Response
Field	Type	Description
payments	Payment[]	Payment records
meta	PaginationMeta	Pagination info



GET /payments/:id
 GET 	/payments/:id
Get a single payment with full allocation breakdown.
Response
Field	Type	Description
payment	Payment	Full payment object



DELETE /payments/:id
 DELETE 	/payments/:id
Reverse a payment. Restores all paid amounts and outstanding balances. Deletes associated ledger entries. Creates an approval record for reversals above a threshold amount.
Request Body
Field	Type	Req.	Description
reason	string	✓	Reversal justification (mandatory for audit)
Response
Field	Type	Description
success	boolean	true on successful reversal
updatedLoan	Loan	Loan with restored outstanding amounts
updatedInstalment	Instalment	Instalment with restored balances
Notes: Reversals above ₦50,000 require Director/MD approval before execution.



GET /loans/:id/payments
 GET 	/loans/:id/payments
Get all payments for a specific loan.
Response
Field	Type	Description
payments	Payment[]	All payments for this loan



POST /payments/bulk-upload
 POST 	/payments/bulk-upload
Upload a CSV/Excel file of payments for batch processing. Validates all rows before committing any.
Request Body
Field	Type	Req.	Description
file	File	✓	CSV or XLSX with columns: loanNumber, date, amount, method, reference
dryRun	boolean	—	If true, validate only without persisting
Response
Field	Type	Description
validRows	integer	Count of valid rows to be processed
invalidRows	object[]	Array of { row, errors[] } for failed rows
jobId	string	Background job ID if committing (poll /jobs/:id for status)



GET /payments/today-summary
 GET 	/payments/today-summary
Aggregate of all payments received today. Used by dashboard.
Response
Field	Type	Description
totalCollected	integer	Total amount received today in kobo
count	integer	Number of payment transactions
byMethod	object[]	Breakdown by payment method: { method, count, amount }



 
7. Approval Workflow
Sensitive create, update, and delete operations on customers and loans are not executed immediately. Instead, they are captured as approval requests that must be acted upon by a Director or MD. This dual-control mechanism ensures all significant changes are reviewed before execution.
7.1  Approval Request Object
Field	Type	Description
id	string	Approval request ID (apr_...)
requestType	string	CREATE_LOAN | EDIT_LOAN | DELETE_LOAN | CREATE_CUSTOMER | EDIT_CUSTOMER | DELETE_CUSTOMER | REVERSE_PAYMENT | WRITE_OFF | ROLE_CHANGE
entityType	string	loan | customer | payment | user
entityId	string	ID of the record being acted upon
payload	object	JSON snapshot of the proposed change (the data to be applied on approval)
previousState	object	JSON snapshot of current state before change (for auditing)
requestedBy	string	User ID who submitted the request
requestedAt	ISO8601	Submission timestamp
status	string	Pending | Approved | Rejected | Cancelled
actionedBy	string	Director/MD who approved or rejected
actionedAt	ISO8601	Decision timestamp
actionNote	string	Optional note from approver
executionResult	object	Result data from execution (populated after approval)

7.2  Endpoints
GET /approvals
 GET 	/approvals
List approval requests. Default shows only Pending. Directors/MDs see all; others see only their own submissions.
Request Body
Field	Type	Req.	Description
status	string	—	Pending | Approved | Rejected | Cancelled
requestType	string	—	Filter by request type
requestedBy	string	—	Filter by submitter user ID
from	date	—	Request date from
page	integer	—	Page number
Response
Field	Type	Description
requests	ApprovalRequest[]	Approval request objects
meta	PaginationMeta	Pagination info



GET /approvals/:id
 GET 	/approvals/:id
Get a single approval request with full payload and diff view.
Response
Field	Type	Description
request	ApprovalRequest	Full approval object with previousState and proposed payload
diff	object[]	Field-level diff: [{ field, before, after }]



POST /approvals/:id/approve
 POST 	/approvals/:id/approve
Execute an approval — applies the payload to the target entity and posts any necessary accounting entries. Only Director or MD roles can call this.
Request Body
Field	Type	Req.	Description
note	string	—	Optional approval comment
Response
Field	Type	Description
request	ApprovalRequest	Updated approval with status: Approved
executionResult	object	The created/updated entity resulting from execution



POST /approvals/:id/reject
 POST 	/approvals/:id/reject
Reject an approval request. The underlying change is not applied.
Request Body
Field	Type	Req.	Description
note	string	✓	Rejection reason (mandatory)
Response
Field	Type	Description
request	ApprovalRequest	Updated approval with status: Rejected



POST /approvals/:id/cancel
 POST 	/approvals/:id/cancel
Cancel a Pending approval request. Only the original requester or a Director/MD can cancel.
Request Body
Field	Type	Req.	Description
note	string	—	Cancellation reason
Response
Field	Type	Description
request	ApprovalRequest	Updated approval with status: Cancelled



GET /approvals/pending-count
 GET 	/approvals/pending-count
Returns count of pending approvals for the badge on the navigation menu.
Response
Field	Type	Description
count	integer	Number of pending approval requests visible to current user



 
8. Accounting & General Ledger
The accounting module implements a full double-entry bookkeeping system. Every financial event (disbursement, payment, fee recognition, accrual) produces balanced journal entries. The general ledger is the single source of truth for financial reporting.
8.1  Chart of Accounts
Code	Account Name	Category	Normal Balance
1101	Cash on Hand	Asset	Debit
1102	Bank — Zenith	Asset	Debit
1103	Bank — GTB	Asset	Debit
1201	Loans to Customers	Asset	Debit
1203	Interest Receivable	Asset	Debit
1204	Management Fee Receivable	Asset	Debit
1206	Penalty Receivable	Asset	Debit
1301	Fixed Assets	Asset	Debit
1302	Accumulated Depreciation	Asset	Credit
2101	Accounts Payable	Liability	Credit
2105	VAT Payable	Liability	Credit
2201	Borrowings	Liability	Credit
3001	Share Capital	Equity	Credit
3002	Retained Earnings	Equity	Credit
4101	Interest Income	Revenue	Credit
4201	Management Fee Income	Revenue	Credit
4202	Upfront Fee Income	Revenue	Credit
4204	Processing Fee Income	Revenue	Credit
4205	Penalty Income	Revenue	Credit
5001	Salaries & Wages	Expense	Debit
5002	Office Rent	Expense	Debit
5003	Bad Debt Expense	Expense	Debit
5101	Operating Expenses	Expense	Debit

8.2  GL Account Endpoints
GET /accounts
 GET 	/accounts
List all GL accounts.
Request Body
Field	Type	Req.	Description
category	string	—	Asset | Liability | Equity | Revenue | Expense
search	string	—	Search by code or name
Response
Field	Type	Description
accounts	GLAccount[]	Array of GL account objects with current balances



POST /accounts
 POST 	/accounts
Create a new GL account.
Request Body
Field	Type	Req.	Description
code	string	✓	Unique account code (e.g., 5102)
name	string	✓	Account name
category	string	✓	Asset | Liability | Equity | Revenue | Expense
normalBalance	string	✓	Debit | Credit
description	string	—	Account description
Response
Field	Type	Description
account	GLAccount	Created account



PUT /accounts/:id
 PUT 	/accounts/:id
Update a GL account. Code cannot be changed once ledger entries exist.
Request Body
Field	Type	Req.	Description
name	string	—	Account name
description	string	—	Description
status	string	—	Active | Inactive
Response
Field	Type	Description
account	GLAccount	Updated account



8.3  Ledger Entry Endpoints
GET /ledger
 GET 	/ledger
Paginated list of all general ledger entries.
Request Body
Field	Type	Req.	Description
accountCode	string	—	Filter by GL account code
referenceType	string	—	loan | payment | expense | journal
referenceId	string	—	Filter by source entity ID
from	date	—	Transaction date from
to	date	—	Transaction date to
page	integer	—	Page number
Response
Field	Type	Description
entries	LedgerEntry[]	Ledger rows with running balance
meta	PaginationMeta	Pagination info



POST /ledger/manual-entry
 POST 	/ledger/manual-entry
Post a manual journal entry. Must be balanced (total debits = total credits). Requires Accountant role minimum.
Request Body
Field	Type	Req.	Description
date	date	✓	Effective date of entry
description	string	✓	Narrative for the journal
lines	JournalLine[]	✓	Array of { accountCode, debitAmount, creditAmount, description }
reference	string	—	External reference number
Response
Field	Type	Description
journalEntryId	string	Created journal reference
lines	LedgerEntry[]	Posted ledger lines
Notes: Validation: Sum of all debitAmount must equal sum of all creditAmount. Minimum 2 lines required.



GET /ledger/account/:code/statement
 GET 	/ledger/account/:code/statement
Get a full account statement with running balance for a specific GL account.
Request Body
Field	Type	Req.	Description
from	date	—	Statement start date
to	date	—	Statement end date
Response
Field	Type	Description
account	GLAccount	Account details
openingBalance	integer	Balance at start of period
closingBalance	integer	Balance at end of period
entries	LedgerEntry[]	Entries with running balance column



 
9. Reporting & Analytics
The reporting module aggregates data from loan, payment, and ledger tables to produce statutory financial statements, portfolio KPIs, and operational dashboards.
9.1  Dashboard & KPI
GET /reports/dashboard
 GET 	/reports/dashboard
Comprehensive dashboard statistics for the main dashboard page.
Response
Field	Type	Description
totalDistributed	integer	Cumulative amount ever disbursed (kobo)
activePrincipal	integer	Outstanding principal on all active loans
activeInterest	integer	Outstanding interest on all active loans
portfolioValue	integer	Total outstanding (principal + interest + fees)
totalOverdue	integer	Total outstanding on overdue loans
activeCustomers	integer	Customers with at least one active loan
totalAssets	integer	Total assets per balance sheet
totalRevenue	integer	YTD revenue recognized
todayPayments	integer	Payments received today
expenses	integer	YTD expenses
pendingApplications	integer	Loans pending approval
equity	integer	Total equity per balance sheet
overdueCount	integer	Number of overdue loans
portfolioAtRisk	decimal	PAR30 ratio (%)
collectionRate	decimal	Collections as % of scheduled payments MTD
recentLoans	RecentLoan[]	Last 10 loans: id, loanNumber, customerName, amount, date, status
recentPayments	RecentPayment[]	Last 10 payments: id, customerName, amount, date, method



GET /reports/portfolio
 GET 	/reports/portfolio
Detailed portfolio breakdown by status, product, and risk category.
Request Body
Field	Type	Req.	Description
asOf	date	—	Point-in-time date (defaults to today)
Response
Field	Type	Description
byStatus	object[]	{ status, count, totalOutstanding }
byDaysOverdue	object[]	Aging buckets: 1–30, 31–60, 61–90, 90+
topBorrowers	object[]	Top 10 by outstanding balance
disbursementTrend	object[]	Monthly disbursements for last 12 months
collectionTrend	object[]	Monthly collections for last 12 months



GET /reports/overdue
 GET 	/reports/overdue
Detailed overdue analysis with aging buckets.
Request Body
Field	Type	Req.	Description
asOf	date	—	Report date
export	string	—	pdf | xlsx — triggers file download
Response
Field	Type	Description
summary	object	{ totalOverdue, overdueCount, PAR30, PAR60, PAR90 }
loans	object[]	Per-loan: loanNumber, customerName, daysOverdue, principalOverdue, interestOverdue, totalOverdue



9.2  Financial Statements
GET /reports/trial-balance
 GET 	/reports/trial-balance
Trial balance as of a specific date.
Request Body
Field	Type	Req.	Description
asOf	date	—	Date for balances (defaults to today)
export	string	—	pdf | xlsx
Response
Field	Type	Description
asOf	date	Report date
lines	object[]	{ accountCode, accountName, category, debitBalance, creditBalance }
totals	object	{ totalDebits, totalCredits } — must be equal



GET /reports/balance-sheet
 GET 	/reports/balance-sheet
Statutory balance sheet (assets = liabilities + equity).
Request Body
Field	Type	Req.	Description
asOf	date	—	Balance sheet date
export	string	—	pdf | xlsx
Response
Field	Type	Description
assets	object	{ currentAssets[], nonCurrentAssets[], totalAssets }
liabilities	object	{ currentLiabilities[], nonCurrentLiabilities[], totalLiabilities }
equity	object	{ components[], totalEquity }
check	boolean	true if assets = liabilities + equity (validation flag)



GET /reports/income-statement
 GET 	/reports/income-statement
Profit and loss statement for a given period.
Request Body
Field	Type	Req.	Description
from	date	—	Period start (defaults to first day of current month)
to	date	—	Period end (defaults to today)
export	string	—	pdf | xlsx
Response
Field	Type	Description
revenue	object[]	Revenue lines: { account, amount }
expenses	object[]	Expense lines: { account, amount }
grossProfit	integer	Revenue minus direct costs
operatingProfit	integer	Gross profit minus operating expenses
netProfit	integer	Bottom-line profit/loss



GET /reports/cash-flow
 GET 	/reports/cash-flow
Cash flow statement classifying cash movements into operating, investing, and financing activities.
Request Body
Field	Type	Req.	Description
from	date	—	Period start
to	date	—	Period end
Response
Field	Type	Description
operating	object	{ items[], netCash }
investing	object	{ items[], netCash }
financing	object	{ items[], netCash }
netChange	integer	Total net change in cash
openingCash	integer	Opening cash balance
closingCash	integer	Closing cash balance



GET /reports/income-analysis
 GET 	/reports/income-analysis
Revenue breakdown by income type with trend analysis.
Request Body
Field	Type	Req.	Description
from	date	—	Analysis start date
to	date	—	Analysis end date
groupBy	string	—	day | week | month | quarter
Response
Field	Type	Description
byType	object[]	{ type, amount, percentage }: interest, fee, penalty breakdowns
trend	object[]	Time-series revenue data
totalRevenue	integer	Total for period



 
10. Expense Management
Expenses are non-loan cash outflows that are recorded against GL accounts and posted to the general ledger as debit entries to the relevant expense account and credit to cash/bank.
10.1  Expense Object
Field	Type	Description
id	string	Expense ID (exp_...)
date	date	Date of expense
description	string	Expense description
amount	integer	Amount in kobo
expenseAccountCode	string	Debit GL account (expense account)
paymentAccountCode	string	Credit GL account (cash or bank)
category	string	Salaries | Rent | Utilities | Office | Travel | Other
vendor	string	Payee name
referenceNumber	string	Receipt or invoice number
attachment	string	URL to uploaded receipt
recordedBy	string	User who recorded the expense
createdAt	ISO8601	Creation timestamp

10.2  Endpoints
GET /expenses
 GET 	/expenses
List all expenses with filters.
Request Body
Field	Type	Req.	Description
from	date	—	Date range start
to	date	—	Date range end
category	string	—	Expense category filter
accountCode	string	—	GL account filter
page	integer	—	Page number
Response
Field	Type	Description
expenses	Expense[]	Expense records
totals	object	{ total, byCategory[] } for period
meta	PaginationMeta	Pagination



POST /expenses
 POST 	/expenses
Record a new expense and post ledger entries.
Request Body
Field	Type	Req.	Description
date	date	✓	Expense date
description	string	✓	Expense description
amount	integer	✓	Amount in kobo
expenseAccountCode	string	✓	GL expense account to debit
paymentAccountCode	string	✓	GL cash/bank account to credit
category	string	✓	Expense category
vendor	string	—	Payee
referenceNumber	string	—	Invoice/receipt ref
attachment	File	—	Receipt upload
Response
Field	Type	Description
expense	Expense	Created expense
ledgerEntries	LedgerEntry[]	Posted debit/credit entries



PUT /expenses/:id
 PUT 	/expenses/:id
Update an expense. Cannot modify expenses from closed accounting periods.
Request Body
Field	Type	Req.	Description
description	string	—	Updated description
amount	integer	—	Updated amount (re-posts ledger entries)
category	string	—	Updated category
Response
Field	Type	Description
expense	Expense	Updated expense



DELETE /expenses/:id
 DELETE 	/expenses/:id
Delete an expense and reverse its ledger entries.
Request Body
Field	Type	Req.	Description
reason	string	✓	Deletion reason
Response
Field	Type	Description
success	boolean	true on success



 
11. Asset Management
Fixed and current assets are tracked separately from loan assets. This module manages physical and intangible assets including acquisition, depreciation, and disposal.
11.1  Asset Object
Field	Type	Description
id	string	Asset ID (ast_...)
name	string	Asset name
assetType	string	Fixed | Current | Intangible
category	string	Equipment | Vehicle | Furniture | Software | Other
acquisitionDate	date	Date purchased/acquired
acquisitionCost	integer	Purchase price in kobo
currentValue	integer	Book value after depreciation
depreciationMethod	string	StraightLine | DecliningBalance | None
usefulLifeMonths	integer	Expected useful life in months
accumulatedDepreciation	integer	Total depreciation to date
glAccountCode	string	Asset GL account
status	string	Active | Disposed | FullyDepreciated
description	string	Notes/description

11.2  Endpoints
GET /assets
 GET 	/assets
List all assets.
Request Body
Field	Type	Req.	Description
type	string	—	Fixed | Current | Intangible
status	string	—	Active | Disposed | FullyDepreciated
Response
Field	Type	Description
assets	Asset[]	Array of asset records



POST /assets
 POST 	/assets
Register a new asset and post acquisition journal entry.
Request Body
Field	Type	Req.	Description
name	string	✓	Asset name
assetType	string	✓	Fixed | Current | Intangible
acquisitionDate	date	✓	Acquisition date
acquisitionCost	integer	✓	Cost in kobo
depreciationMethod	string	✓	Depreciation method
usefulLifeMonths	integer	—	Required for depreciable assets
glAccountCode	string	✓	Asset account code
Response
Field	Type	Description
asset	Asset	Created asset record



POST /assets/:id/depreciate
 POST 	/assets/:id/depreciate
Run depreciation for a specific asset for the current period and post journal entry.
Request Body
Field	Type	Req.	Description
period	string	✓	Period in YYYY-MM format
Response
Field	Type	Description
asset	Asset	Asset with updated book value
depreciationAmount	integer	Amount depreciated this period
journalEntryId	string	Posted journal reference



 
12. Notifications
Notifications keep users informed of pending approvals, overdue loans, upcoming payment due dates, and system events.
12.1  Notification Object
Field	Type	Description
id	string	Notification ID
userId	string	Target user
type	string	APPROVAL_PENDING | LOAN_OVERDUE | PAYMENT_DUE | PAYMENT_RECEIVED | SYSTEM
title	string	Short notification title
message	string	Notification body text
entityType	string	loan | payment | approval | customer
entityId	string	ID of the referenced entity
read	boolean	Whether the notification has been read
createdAt	ISO8601	Creation timestamp

12.2  Endpoints
GET /notifications
 GET 	/notifications
Get notifications for the current authenticated user.
Request Body
Field	Type	Req.	Description
read	boolean	—	Filter by read status
type	string	—	Notification type filter
page	integer	—	Page number
Response
Field	Type	Description
notifications	Notification[]	Notification records
unreadCount	integer	Total unread count for badge display



PATCH /notifications/:id/read
 PATCH 	/notifications/:id/read
Mark a single notification as read.
Response
Field	Type	Description
success	boolean	true



PATCH /notifications/read-all
 PATCH 	/notifications/read-all
Mark all unread notifications as read for current user.
Response
Field	Type	Description
count	integer	Number of notifications marked as read



 
13. Overdue Management & Background Jobs
Overdue tracking is maintained by a nightly background job that recalculates days overdue for all active loans and instalments, triggers notifications, and updates portfolio status flags.
13.1  Overdue Endpoints
POST /system/update-overdue
 POST 	/system/update-overdue
Manually trigger the overdue recalculation job. Normally runs automatically at midnight.
Response
Field	Type	Description
jobId	string	Background job ID
loansUpdated	integer	Number of loans whose overdue status changed
Notes: Requires Admin or Developer role.



GET /system/jobs/:id
 GET 	/system/jobs/:id
Poll the status of a background job.
Response
Field	Type	Description
jobId	string	Job reference
status	string	queued | running | completed | failed
progress	integer	Completion percentage (0–100)
result	object	Result data when completed
error	string	Error message if failed



13.2  Accruals & Period Close
POST /accounting/accrue
 POST 	/accounting/accrue
Run month-end interest accruals. Posts interest receivable and income entries for all active loans.
Request Body
Field	Type	Req.	Description
period	string	✓	Accrual period in YYYY-MM format
dryRun	boolean	—	Preview without posting
Response
Field	Type	Description
journalEntries	object[]	Accrual entries to be (or already) posted
totalAccrued	integer	Total interest amount accrued



13.3  Audit Log
GET /audit-log
 GET 	/audit-log
System-wide audit trail of all create, update, delete, and approval actions.
Request Body
Field	Type	Req.	Description
userId	string	—	Filter by actor
entityType	string	—	loan | customer | payment | user | expense
entityId	string	—	Specific entity
action	string	—	create | update | delete | approve | reject
from	date	—	Date range start
to	date	—	Date range end
page	integer	—	Page number
Response
Field	Type	Description
logs	AuditLog[]	id, userId, userName, action, entityType, entityId, payload, ipAddress, userAgent, timestamp
meta	PaginationMeta	Pagination



 
14. Error Code Reference
All API errors return a structured error object with a machine-readable code. The following table lists all defined error codes.
Error Code	HTTP Status	Description
VALIDATION_FAILED	400	One or more input fields failed validation; see details array
AUTHENTICATION_REQUIRED	401	No valid Bearer token provided
TOKEN_EXPIRED	401	JWT has expired; use refresh endpoint
INSUFFICIENT_PERMISSIONS	403	Role does not have access to this operation
CUSTOMER_NOT_FOUND	404	No customer with the given ID exists
LOAN_NOT_FOUND	404	No loan with the given ID exists
PAYMENT_NOT_FOUND	404	No payment with the given ID exists
APPROVAL_NOT_FOUND	404	No approval request with the given ID exists
ACCOUNT_NOT_FOUND	404	GL account code does not exist
DUPLICATE_BVN	409	BVN already registered to another customer
DUPLICATE_LOAN_NUMBER	409	Loan number already exists
LOAN_ALREADY_SETTLED	409	Cannot modify a settled loan
LOAN_ALREADY_ACTIVE	409	Action not allowed on an active loan without Director override
PAYMENT_EXCEEDS_OUTSTANDING	422	Payment amount greater than total outstanding on instalment
UNBALANCED_JOURNAL	422	Total debits do not equal total credits in manual journal entry
CUSTOMER_BLACKLISTED	422	Customer is blacklisted and cannot receive new loans
INSTALMENT_NOT_DUE	422	Instalment is not yet due for payment
PERIOD_CLOSED	422	Cannot post to a closed accounting period
APPROVAL_ALREADY_ACTIONED	409	Approval request has already been approved or rejected
SCHEDULE_RECALCULATION_FAILED	500	Internal error during instalment schedule regeneration
LEDGER_POST_FAILED	500	Double-entry posting failed; transaction rolled back
FILE_TOO_LARGE	400	Uploaded file exceeds 5 MB limit
UNSUPPORTED_FILE_TYPE	400	File type not permitted (allowed: JPEG, PNG, PDF)
 
Appendix A — Loan Calculation Formulae
All monetary amounts in the system are stored and transmitted as integers in kobo (1 NGN = 100 kobo). Calculation results are rounded to the nearest ₦10 (1,000 kobo) before storage.
A.1  Monthly Payment (PMT)
PMT = P × [ r(1+r)^n ] / [ (1+r)^n - 1 ]

Where:
  P = Principal (totalDisbursed)
  r = Monthly interest rate (annualRate / 12 / 100)
  n = Number of instalments

Special case — zero interest:
  PMT = P / n
A.2  Interest Per Period (IPMT)
IPMT(period) = openingBalance(period) × r

Where openingBalance(1) = totalDisbursed
      openingBalance(k) = closingBalance(k-1)
A.3  Principal Per Period (PPMT)
PPMT(period) = PMT - IPMT(period)
             = openingBalance(period) - closingBalance(period)
A.4  Management Fee Treatment
When deductFeeUpfront = true:
•	Management fee is subtracted from loan amount before disbursement
•	totalDisbursed = loanAmount − managementFeeAmount
•	Installment 1 management fee = 0
When deductFeeUpfront = false:
•	Customer receives full loanAmount
•	managementFee is spread across installments 2 through n
•	Installment 1 management fee = 0 (grace period by convention)
A.5  Rounding Rules
// Round to nearest ₦10 unit (1,000 kobo)
roundedPrincipal = Math.round(principal / 1000) * 1000
roundedInterest  = Math.round(interest  / 1000) * 1000
roundedFee       = Math.round(fee        / 1000) * 1000

// Reconciliation: final instalment absorbs rounding residual
// to ensure sum of principal payments = totalDisbursed
Appendix B — Accounting Journal Templates
B.1  Loan Disbursement
Ref	Account	Debit (kobo)	Credit (kobo)
DR	1201 — Loans to Customers	loanAmount	—
CR	1101/1102/1103 — Cash/Bank	—	totalDisbursed
CR	4202 — Upfront Fee Income	—	managementFeeAmount (if upfront)
CR	2105 — VAT Payable	—	VAT on fee (7.5%)

B.2  Regular Payment Receipt
Ref	Account	Debit (kobo)	Credit (kobo)
DR	1101/1102/1103 — Cash/Bank	paymentAmount	—
CR	1201 — Loans to Customers	—	principalAmount
CR	4101 — Interest Income	—	interestAmount
CR	4201 — Management Fee Income	—	monitoringFee
CR	4205 — Penalty Income	—	penalties (if any)

Appendix C — TypeScript Type Definitions
type UserRole = 'Director' | 'MD' | 'Accountant' | 'Secretary' | 'Admin' | 'Developer';
type LoanStatus = 'Pending' | 'Active' | 'Overdue' | 'Settled' | 'Rejected' | 'Written-Off';
type InstalmentStatus = 'Pending' | 'Paid' | 'PartiallyPaid' | 'Overdue' | 'Waived';
type PaymentMethod = 'Cash' | 'BankTransfer' | 'Cheque' | 'POS' | 'USSD' | 'Mobile';
type AccountCategory = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

interface PaginationMeta {
  page:     number;
  perPage:  number;
  total:    number;
  cursor?:  string;
  hasMore:  boolean;
}

interface APIResponse<T> {
  success: boolean;
  data:    T;
  meta?:   PaginationMeta;
}

interface APIError {
  success: false;
  error: {
    code:     string;
    message:  string;
    details?: { field: string; issue: string }[];
  };
}
