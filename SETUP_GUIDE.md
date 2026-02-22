# Odoo 17 Local Development Setup — Windows

## Recommended Folder Structure

```
C:\odoo-dev\
├── odoo\                  # Odoo source code (cloned from GitHub)
├── custom-addons\         # Your custom modules (symlink or copy)
├── venv\                  # Python virtual environment
├── odoo.conf              # Configuration file
└── odoo.log               # Log file (auto-created)
```

---

## Step 1: Create Project Directory

```powershell
mkdir C:\odoo-dev
cd C:\odoo-dev
```

## Step 2: Clone Odoo 17

```powershell
git clone https://github.com/odoo/odoo.git --depth 1 --branch 17.0 C:\odoo-dev\odoo
```

## Step 3: Create Virtual Environment

```powershell
python -m venv C:\odoo-dev\venv
C:\odoo-dev\venv\Scripts\Activate.ps1
```

> If you get an execution policy error, run first:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```

## Step 4: Install Dependencies

```powershell
cd C:\odoo-dev\odoo
pip install setuptools wheel
pip install -r requirements.txt
```

### Common dependency fixes

| Error | Fix |
|---|---|
| `greenlet` build failure | `pip install greenlet` — if it fails, install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with "Desktop development with C++" workload |
| `psycopg2` failure | `pip install psycopg2-binary` |
| `lxml` failure | `pip install lxml` from [Unofficial Windows Binaries](https://www.lfd.uci.edu/~gohlke/pythonlibs/) or try `pip install lxml==5.1.0` |
| `reportlab` or `Pillow` failure | `pip install reportlab Pillow` separately |
| `ldap` failure (optional) | Skip it — comment out `python-ldap` in `requirements.txt` if not needed |

## Step 5: Set Up PostgreSQL

Open **pgAdmin** or **psql** shell and run:

```sql
CREATE USER odoo17 WITH PASSWORD 'odoo17' CREATEDB LOGIN;
CREATE DATABASE odoo17 OWNER odoo17 ENCODING 'UTF8';
```

Or via command line (if `psql` is in PATH):

```powershell
psql -U postgres -c "CREATE USER odoo17 WITH PASSWORD 'odoo17' CREATEDB LOGIN;"
psql -U postgres -c "CREATE DATABASE odoo17 OWNER odoo17 ENCODING 'UTF8';"
```

> **Note:** If prompted for a password, use your PostgreSQL superuser (`postgres`) password.

## Step 6: Create Custom Addons Directory

```powershell
mkdir C:\odoo-dev\custom-addons
```

Copy or symlink your modules here. For example, to link your hackathon project:

```powershell
# Option A: Copy
Copy-Item -Recurse "C:\Users\meeto\OneDrive\Desktop\odoo-hackathon-2026\FleetIQ" "C:\odoo-dev\custom-addons\FleetIQ"

# Option B: Symlink (run PowerShell as Administrator)
New-Item -ItemType SymbolicLink -Path "C:\odoo-dev\custom-addons\FleetIQ" -Target "C:\Users\meeto\OneDrive\Desktop\odoo-hackathon-2026\FleetIQ"
```

## Step 7: Create `odoo.conf`

Create `C:\odoo-dev\odoo.conf` with the following content:

```ini
[options]
admin_passwd = admin
db_host = localhost
db_port = 5432
db_user = odoo17
db_password = odoo17
db_name = odoo17
addons_path = C:\odoo-dev\odoo\addons,C:\odoo-dev\custom-addons
default_productivity_apps = True
http_port = 8069
logfile = C:\odoo-dev\odoo.log
log_level = info
workers = 0
limit_memory_hard = 2684354560
limit_memory_soft = 2147483648
limit_time_cpu = 600
limit_time_real = 1200
```

## Step 8: Run Odoo

```powershell
cd C:\odoo-dev
.\venv\Scripts\Activate.ps1
python odoo\odoo-bin -c odoo.conf
```

First run will initialize the database. Open your browser at:

```
http://localhost:8069
```

Default credentials: **admin / admin**

### Useful run flags

| Flag | Purpose |
|---|---|
| `-i FleetIQ` | Install a module on startup |
| `-u FleetIQ` | Update a module on startup |
| `--dev=all` | Enable dev mode (auto-reload Python + XML) |
| `-d odoo17` | Specify database |
| `--stop-after-init` | Exit after init (useful for scripted installs) |

**Example — install your module:**

```powershell
python odoo\odoo-bin -c odoo.conf -i FleetIQ
```

**Example — dev mode with auto-reload:**

```powershell
python odoo\odoo-bin -c odoo.conf --dev=all
```

---

## How to Add & Load Custom Modules

1. Place your module folder inside `C:\odoo-dev\custom-addons\`
2. Ensure the module has `__manifest__.py` and `__init__.py`
3. Restart Odoo
4. Go to **Apps** → click **Update Apps List**
5. Search for your module → click **Install**

Or from command line:

```powershell
python odoo\odoo-bin -c odoo.conf -i your_module_name
```

To update after code changes:

```powershell
python odoo\odoo-bin -c odoo.conf -u your_module_name
```

---

## Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `FATAL: password authentication failed for user "odoo17"` | Wrong PG credentials | Verify user/password in pgAdmin; check `pg_hba.conf` uses `md5` or `scram-sha-256` |
| `port 8069 already in use` | Another Odoo instance running | Kill the process: `Stop-Process -Name python -Force` or change `http_port` in `odoo.conf` |
| `Module FleetIQ not found` | Module not in `addons_path` | Verify `addons_path` in `odoo.conf` includes your custom addons directory |
| `ModuleNotFoundError: No module named 'odoo'` | venv not activated or wrong Python | Activate venv first; ensure you're using the venv Python |
| `relation "ir_module_module" does not exist` | Empty/corrupt database | Drop and recreate the database, then reinitialize |
| `could not connect to server` | PostgreSQL not running | Start PostgreSQL service: `net start postgresql-x64-16` (adjust version) |
| XML/CSV parse errors | Syntax errors in data files | Validate XML structure; check CSV has no trailing commas or BOM characters |
| `QWeb template not found` | Missing view inheritance | Run with `-u your_module` to reload all views |

---

## Quick Reference Commands

```powershell
# Activate environment
cd C:\odoo-dev
.\venv\Scripts\Activate.ps1

# Run Odoo
python odoo\odoo-bin -c odoo.conf

# Run in dev mode
python odoo\odoo-bin -c odoo.conf --dev=all

# Install module
python odoo\odoo-bin -c odoo.conf -i FleetIQ

# Update module
python odoo\odoo-bin -c odoo.conf -u FleetIQ

# Run Odoo shell (interactive Python with Odoo env)
python odoo\odoo-bin shell -c odoo.conf -d odoo17

# Scaffold a new module
python odoo\odoo-bin scaffold my_new_module C:\odoo-dev\custom-addons
```
