# Enterprise RBAC Schema Design

## Overview
This document outlines the comprehensive Role-Based Access Control (RBAC) system for ArchiGenie, designed for enterprise-grade multi-tenant architecture with fine-grained permissions.

## Role Hierarchy

### 1. Super Admin (Global)
- Full system access across all organizations
- Can manage global system settings
- Can create/manage organizations
- Can assign organization owners

### 2. Organization Owner
- Full access within their organization
- Can manage organization settings
- Can invite/remove organization members
- Can assign roles within organization
- Can create/manage projects

### 3. Project Manager
- Can manage specific projects they're assigned to
- Can invite project collaborators
- Can manage project settings and assets
- Can assign project-level roles

### 4. Project Collaborator
- Can edit and contribute to assigned projects
- Can view/edit project assets
- Cannot manage project settings or invite others

### 5. Project Viewer
- Read-only access to assigned projects
- Can view project assets and data
- Cannot edit or modify anything

## Database Models

### Organizations
- Multi-tenant support
- Each organization is isolated
- Can have custom branding and settings

### Roles
- System-defined roles with hierarchical structure
- Custom roles can be created within organizations
- Roles inherit permissions from parent roles

### Permissions
- Fine-grained resource and action based permissions
- Supports resource-level permissions (project-specific, etc.)
- Can be combined into permission sets

### User-Role Assignments
- Users can have different roles in different organizations
- Project-specific role assignments
- Time-based role assignments (expiration)

### Audit Trail
- All permission changes tracked
- User action logging
- Access attempt logging

## Permission Categories

### System Permissions
- system.admin.full
- system.organizations.manage
- system.users.manage
- system.settings.manage

### Organization Permissions
- org.manage
- org.users.invite
- org.users.manage
- org.projects.create
- org.projects.manage
- org.settings.manage

### Project Permissions
- project.view
- project.edit
- project.manage
- project.assets.view
- project.assets.edit
- project.assets.manage
- project.collaborators.invite
- project.collaborators.manage

## Security Features

### Row-Level Security
- Database-level enforcement of multi-tenancy
- Users can only access data from their organizations
- Project-level access control

### Permission Inheritance
- Roles inherit permissions from parent roles
- Organization owners inherit all project permissions
- Flexible override mechanisms

### Time-Based Access
- Role assignments can have expiration dates
- Temporary access grants
- Automatic permission revocation