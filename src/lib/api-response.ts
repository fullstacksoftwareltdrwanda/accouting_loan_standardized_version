import { NextResponse } from "next/server";

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  hasMore: boolean;
  cursor?: string;
}

export function successResponse<T>(
  data: T,
  meta?: PaginationMeta,
  status = 200
): NextResponse {
  return NextResponse.json({ success: true, data, ...(meta ? { meta } : {}) }, { status });
}

export function createdResponse<T>(data: T): NextResponse {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function errorResponse(
  code: string,
  message: string,
  details?: { field: string; issue: string }[],
  status = 400
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, ...(details ? { details } : {}) },
    },
    { status }
  );
}

// Common error shortcuts
export const unauthorized = () =>
  errorResponse("AUTHENTICATION_REQUIRED", "No valid Bearer token provided.", undefined, 401);

export const tokenExpired = () =>
  errorResponse("TOKEN_EXPIRED", "JWT has expired; use the refresh endpoint.", undefined, 401);

export const forbidden = () =>
  errorResponse("INSUFFICIENT_PERMISSIONS", "Your role does not have access to this operation.", undefined, 403);

export const notFound = (entity: string) =>
  errorResponse(`${entity.toUpperCase()}_NOT_FOUND`, `No ${entity} with the given identifier exists.`, undefined, 404);

export const conflict = (code: string, message: string) =>
  errorResponse(code, message, undefined, 409);

export const unprocessable = (code: string, message: string) =>
  errorResponse(code, message, undefined, 422);

export const serverError = (message = "An unexpected internal error occurred.") =>
  errorResponse("INTERNAL_SERVER_ERROR", message, undefined, 500);

export function validationError(
  details: { field: string; issue: string }[]
): NextResponse {
  return errorResponse("VALIDATION_FAILED", "One or more input fields failed validation.", details, 400);
}

export function buildPaginationMeta(
  total: number,
  page: number,
  perPage: number
): PaginationMeta {
  return { page, perPage, total, hasMore: page * perPage < total };
}
