import { Asset } from "@/types/expense";

export const MOCK_ASSETS: Asset[] = [
  {
    id: "ast_1",
    name: "MacBook Pro M3 - Dev Unit 01",
    category: "Electronics",
    serialNumber: "SN-APL-2024-001",
    purchaseDate: "2024-01-15",
    value: 2500.00,
    depreciationRate: 20,
    currentValue: 1900.00,
    status: "active"
  },
  {
    id: "ast_2",
    name: "Ergonomic Office Chair - Mesh",
    category: "Furniture",
    serialNumber: "SN-FUR-099",
    purchaseDate: "2023-06-10",
    value: 450.00,
    depreciationRate: 10,
    currentValue: 380.00,
    status: "active"
  },
  {
    id: "ast_3",
    name: "Delivery Motorbike - Honda",
    category: "Vehicles",
    serialNumber: "SN-VEH-882",
    purchaseDate: "2024-02-20",
    value: 3200.00,
    depreciationRate: 15,
    currentValue: 2800.00,
    status: "active"
  },
  {
    id: "ast_4",
    name: "iPhone 15 Pro - Marketing Unit",
    category: "Electronics",
    serialNumber: "SN-APL-2024-099",
    purchaseDate: "2024-03-05",
    value: 1200.00,
    depreciationRate: 25,
    currentValue: 1050.00,
    status: "active"
  },
  {
    id: "ast_5",
    name: "Conference Room Table - Oak",
    category: "Furniture",
    serialNumber: "SN-FUR-201",
    purchaseDate: "2022-11-20",
    value: 1500.00,
    depreciationRate: 8,
    currentValue: 1250.00,
    status: "active"
  }
];
