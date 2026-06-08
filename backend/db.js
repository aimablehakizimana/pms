const mysql = require('mysql2');
require('dotenv').config();

const bootstrap = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true
});

bootstrap.connect((err) => {
  if (err) { console.error('DB connection error:', err); process.exit(1); }

  const sql = `
    CREATE DATABASE IF NOT EXISTS PMS;
    USE PMS;

    CREATE TABLE IF NOT EXISTS Users (
      UserID INT AUTO_INCREMENT PRIMARY KEY,
      UserName VARCHAR(100) NOT NULL UNIQUE,
      Password VARCHAR(255) NOT NULL,
      Role ENUM('Admin','Staff') NOT NULL DEFAULT 'Staff'
    );

    CREATE TABLE IF NOT EXISTS Vehicle (
      VehicleID INT AUTO_INCREMENT PRIMARY KEY,
      Plate_Number VARCHAR(20) NOT NULL UNIQUE,
      Brand VARCHAR(100) NOT NULL,
      Model VARCHAR(100) NOT NULL,
      Year INT NOT NULL,
      Vehicle_Type VARCHAR(50) NOT NULL,
      Purchase_Price DECIMAL(12,2) NOT NULL,
      Status ENUM('Available','Rented','Sold','Maintenance') NOT NULL DEFAULT 'Available',
      UserID INT NOT NULL,
      FOREIGN KEY (UserID) REFERENCES Users(UserID)
    );

    CREATE TABLE IF NOT EXISTS Customer (
      CustomerID INT AUTO_INCREMENT PRIMARY KEY,
      FirstName VARCHAR(100) NOT NULL,
      LastName VARCHAR(100) NOT NULL,
      Email VARCHAR(150) NOT NULL UNIQUE,
      PhoneNumber VARCHAR(20) NOT NULL,
      CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      Status ENUM('Active','Inactive','Blocked') NOT NULL DEFAULT 'Active',
      UserID INT NOT NULL,
      FOREIGN KEY (UserID) REFERENCES Users(UserID)
    );

    CREATE TABLE IF NOT EXISTS Promotion (
      PromotionID INT AUTO_INCREMENT PRIMARY KEY,
      Title ENUM('New Year Sale','Holiday Price Slash','Weekend Flash Sale','Clearance Discount Offer','Seasonal Price Drop') NOT NULL,
      Description TEXT,
      Discount_Type ENUM('Free','Percentage','Flat Rate','Cashback','Buy One Get One','Bundle','Amount') NOT NULL,
      Discount_Value DECIMAL(10,2) NOT NULL DEFAULT 0,
      Start_Date DATE NOT NULL,
      End_Date DATE NOT NULL,
      Status ENUM('Active','Inactive','Expired') NOT NULL DEFAULT 'Active',
      UserID INT NOT NULL,
      FOREIGN KEY (UserID) REFERENCES Users(UserID)
    );

    CREATE TABLE IF NOT EXISTS Promotion_Vehicle (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      PromotionID INT NOT NULL,
      VehicleID INT NOT NULL,
      Performance VARCHAR(255),
      FOREIGN KEY (PromotionID) REFERENCES Promotion(PromotionID) ON DELETE CASCADE,
      FOREIGN KEY (VehicleID) REFERENCES Vehicle(VehicleID) ON DELETE CASCADE,
      UNIQUE KEY unique_promo_vehicle (PromotionID, VehicleID)
    );
  `;

  bootstrap.query(sql, (err) => {
    bootstrap.end();
    if (err) { console.error('DB setup error:', err); process.exit(1); }
    console.log('Database PMS ready');
  });
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'PMS'
});

db.connect((err) => {
  if (err) { console.error('Main DB connection error:', err); process.exit(1); }
  console.log('Connected to MySQL — PMS database');
});

module.exports = db;
