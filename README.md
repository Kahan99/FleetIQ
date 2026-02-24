# FleetIQ - Professional Fleet Management System

FleetIQ is a high-performance, production-ready fleet management system built on **Odoo 17** with a modern **headless React** frontend. It provides a comprehensive suite for managing vehicles, drivers, trips, maintenance, and expenses.

## 🚀 Key Features

- **Dynamic Dashboard**: Real-time operational analytics and financial reports.
- **Vehicle Management**: Track fleet details, status, and health metrics.
- **Driver Operations**: Manage driver profiles, licenses, and safety scores.
- **Trip Tracking**: Full lifecycle management of cargo trips from dispatch to completion.
- **Maintenance Logs**: Record service history and track maintenance costs.
- **Expense Tracking**: Monitor fuel and operational expenses per vehicle and trip.
- **Integrated API**: Custom REST API serving a headless architecture.

## 🏗️ Architecture

FleetIQ follows a **Headless ERP** design pattern:
- **Backend**: Odoo 17 (Python) - Handles business logic, security, and the PostgreSQL database.
- **Frontend**: React (Vite/Tailwind) - Provides a premium, responsive user experience.
- **Communication**: Custom REST API layer implemented within Odoo controllers.

---

## 🛠️ Installation & Setup

### Prerequisites

- **Python 3.10+**
- **PostgreSQL**
- **Node.js 18+**
- **Odoo 17.0**

### 1. Odoo Backend Setup

1. **Clone Odoo 17**:
   ```powershell
   git clone https://github.com/odoo/odoo.git --depth 1 --branch 17.0 C:\odoo-dev\odoo
   ```

2. **Setup Virtual Environment**:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r C:\odoo-dev\odoo\requirements.txt
   ```

3. **Database Configuration**:
   Create a PostgreSQL user and database:
   ```sql
   CREATE USER odoo17 WITH PASSWORD 'odoo17' CREATEDB LOGIN;
   CREATE DATABASE odoo17 OWNER odoo17 ENCODING 'UTF8';
   ```

4. **Addon Installation**:
   Add the FleetIQ directory to your `addons_path` in `odoo.conf`.
   ```powershell
   python odoo\odoo-bin -c odoo.conf -i FleetIQ
   ```

### 2. Frontend React Setup

1. **Navigate to UI Directory**:
   ```powershell
   cd static/src/fleetflow-ui
   ```

2. **Install Dependencies**:
   ```powershell
   npm install
   ```

3. **Run Development Server**:
   ```powershell
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

---

## 📂 Project Structure

- `models/`: Odoo Python models (Business Logic).
- `controllers/`: Custom REST API endpoints.
- `views/`: Odoo XML views and menus.
- `static/src/fleetflow-ui/`: The headless React frontend.
- `security/`: Access rights and security groups.
- `data/`: Default sequences and configuration data.
- `reports/`: Action and template definitions for reports.

## 📄 License

This project is licensed under the **LGPL-3** License.
