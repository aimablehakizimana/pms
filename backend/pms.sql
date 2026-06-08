-- ============================================================
--  SwiftWheels Enterprises
--  Promotion and Marketing Subsystem (PMS)
--  Database: PMS
--  Location: Huye City, Southern Province, Rwanda
-- ============================================================

CREATE DATABASE IF NOT EXISTS PMS;
USE PMS;

-- ------------------------------------------------------------
-- Table: Users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Users (
    UserID   INT AUTO_INCREMENT PRIMARY KEY,
    UserName VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Role     ENUM('Admin', 'Staff') NOT NULL DEFAULT 'Staff'
);

-- ------------------------------------------------------------
-- Table: Vehicle
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Vehicle (
    VehicleID      INT AUTO_INCREMENT PRIMARY KEY,
    Plate_Number   VARCHAR(20)      NOT NULL UNIQUE,
    Brand          VARCHAR(100)     NOT NULL,
    Model          VARCHAR(100)     NOT NULL,
    Year           INT              NOT NULL,
    Vehicle_Type   VARCHAR(50)      NOT NULL,
    Purchase_Price DECIMAL(12, 2)   NOT NULL,
    Status         ENUM('Available', 'Rented', 'Sold', 'Maintenance') NOT NULL DEFAULT 'Available',
    UserID         INT              NOT NULL,
    CONSTRAINT fk_vehicle_user FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- ------------------------------------------------------------
-- Table: Customer
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Customer (
    CustomerID  INT AUTO_INCREMENT PRIMARY KEY,
    FirstName   VARCHAR(100)  NOT NULL,
    LastName    VARCHAR(100)  NOT NULL,
    Email       VARCHAR(150)  NOT NULL UNIQUE,
    PhoneNumber VARCHAR(20)   NOT NULL,
    CreatedAt   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    Status      ENUM('Active', 'Inactive', 'Blocked') NOT NULL DEFAULT 'Active',
    UserID      INT           NOT NULL,
    CONSTRAINT fk_customer_user FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- ------------------------------------------------------------
-- Table: Promotion
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Promotion (
    PromotionID    INT AUTO_INCREMENT PRIMARY KEY,
    Title          ENUM(
                       'New Year Sale',
                       'Holiday Price Slash',
                       'Weekend Flash Sale',
                       'Clearance Discount Offer',
                       'Seasonal Price Drop'
                   ) NOT NULL,
    Description    TEXT,
    Discount_Type  ENUM(
                       'Free',
                       'Percentage',
                       'Flat Rate',
                       'Cashback',
                       'Buy One Get One',
                       'Bundle',
                       'Amount'
                   ) NOT NULL,
    Discount_Value DECIMAL(10, 2) NOT NULL DEFAULT 0,
    Start_Date     DATE           NOT NULL,
    End_Date       DATE           NOT NULL,
    Status         ENUM('Active', 'Inactive', 'Expired') NOT NULL DEFAULT 'Active',
    UserID         INT            NOT NULL,
    CONSTRAINT fk_promotion_user FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- ------------------------------------------------------------
-- Table: Promotion_Vehicle  (junction / linking table)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Promotion_Vehicle (
    ID          INT AUTO_INCREMENT PRIMARY KEY,
    PromotionID INT          NOT NULL,
    VehicleID   INT          NOT NULL,
    Performance VARCHAR(255),
    CONSTRAINT fk_pv_promotion FOREIGN KEY (PromotionID) REFERENCES Promotion(PromotionID) ON DELETE CASCADE,
    CONSTRAINT fk_pv_vehicle   FOREIGN KEY (VehicleID)   REFERENCES Vehicle(VehicleID)     ON DELETE CASCADE,
    CONSTRAINT uq_promo_vehicle UNIQUE (PromotionID, VehicleID)
);

-- ============================================================
-- Sample Data
-- ============================================================

-- Users (passwords are bcrypt hashes of "password123")
INSERT INTO Users (UserName, Password, Role) VALUES
('admin',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin'),
('staff1',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Staff');

-- Vehicles
INSERT INTO Vehicle (Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status, UserID) VALUES
('RAA 001 A', 'Toyota',   'Corolla',    2020, 'Sedan',  18000000, 'Available',   1),
('RAB 002 B', 'Toyota',   'Land Cruiser',2019,'SUV',    85000000, 'Rented',      1),
('RAC 003 C', 'Nissan',   'Hardbody',   2021, 'Pickup', 32000000, 'Available',   1),
('RAD 004 D', 'Mercedes', 'Sprinter',   2022, 'Van',    55000000, 'Available',   2),
('RAE 005 E', 'Honda',    'Fit',        2018, 'Sedan',  12000000, 'Maintenance', 2);

-- Customers
INSERT INTO Customer (FirstName, LastName, Email, PhoneNumber, Status, UserID) VALUES
('Jean',    'Mutoni',   'jean.mutoni@email.com',   '+250788000001', 'Active',   1),
('Alice',   'Uwase',    'alice.uwase@email.com',    '+250788000002', 'Active',   1),
('Patrick', 'Habimana', 'p.habimana@email.com',     '+250788000003', 'Inactive', 1),
('Grace',   'Ingabire', 'grace.ingabire@email.com', '+250788000004', 'Active',   2),
('Eric',    'Niyonzima','eric.niyonzima@email.com', '+250788000005', 'Blocked',  2);

-- Promotions
INSERT INTO Promotion (Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status, UserID) VALUES
('New Year Sale',          'Start the year with amazing rental deals.',         'Percentage',      20,    '2025-01-01', '2025-01-31', 'Expired', 1),
('Weekend Flash Sale',     'Limited weekend offers on selected vehicles.',       'Flat Rate',       50000, '2025-06-14', '2025-06-15', 'Expired', 1),
('Holiday Price Slash',    'Holiday season discounts across all vehicle types.', 'Amount',          30000, '2025-12-20', '2025-12-31', 'Active',  1),
('Clearance Discount Offer','End-of-year clearance on older models.',            'Cashback',        15000, '2025-11-01', '2025-11-30', 'Active',  2),
('Seasonal Price Drop',    'Buy one day rent, get one day free.',                'Buy One Get One', 0,     '2025-07-01', '2025-07-31', 'Expired', 2);

-- Promotion_Vehicle links
INSERT INTO Promotion_Vehicle (PromotionID, VehicleID, Performance) VALUES
(1, 1, 'High demand — 15 bookings in January'),
(1, 2, 'Moderate — 6 bookings in January'),
(2, 3, 'Very high — fully booked both days'),
(3, 4, 'Ongoing — 3 bookings so far'),
(4, 5, 'Low — vehicle in maintenance'),
(5, 1, 'Good — 10 customers used the offer');
