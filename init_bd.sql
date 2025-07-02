-- Основные справочные таблицы
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    comment TEXT
);

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    parent_id INTEGER REFERENCES departments(id),
    name VARCHAR(255) NOT NULL,
    comment TEXT
);

CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Данные о сотрудниках
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    birth_date DATE,
    passport_series VARCHAR(4),
    passport_number VARCHAR(6),
    passport_issue_date DATE,
    passport_department_code VARCHAR(7),
    passport_issued_by TEXT,
    registration_address JSONB
);

-- Хранение файлов
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255),
    content BYTEA,
    employee_id INTEGER REFERENCES employees(id)
);

-- Кадровые операции
CREATE TABLE personnel_operations (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    operation_type VARCHAR(50) CHECK (
        operation_type IN ('hire', 'salary_change', 'department_transfer', 'dismissal')
    ),
    department_id INTEGER REFERENCES departments(id),
    position_id INTEGER REFERENCES positions(id),
    salary DECIMAL(15,2),
    operation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- История изменений
CREATE TABLE audit_history (
    id SERIAL PRIMARY KEY,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(255),
    object_type VARCHAR(50),
    object_id INTEGER,
    field_name VARCHAR(255),
    old_value TEXT,
    new_value TEXT
);

-- Система пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    login VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (
        role IN ('admin', 'hr_manager')
    )
);

-- Индекс для быстрого поиска сотрудников по паспортным данным
CREATE INDEX idx_employee_passport ON employees(passport_series, passport_number);

-- Индекс для эффективного отслеживания истории изменений
CREATE INDEX idx_audit_history_object ON audit_history(object_type, object_id);

-- Индекс для быстрого поиска файлов сотрудника
CREATE INDEX idx_files_employee ON files(employee_id);