// src/features/Admin/UserManagementTable.tsx

import React from 'react';
import { Table } from 'react-bootstrap';

interface User {
  id: string;
  username: string;
  email: string;
}

interface UserManagementTableProps {
  users: User[];
  onDeleteUser: (id: string) => void;
}

const UserActionButtons: React.FC<{ onDelete: () => void }> = ({ onDelete }) => (
  <button type="button" onClick={onDelete} className="btn btn-danger">
    삭제
  </button>
);

const UserManagementTable: React.FC<UserManagementTableProps> = ({ users = [], onDeleteUser }) => (
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>ID</th>
        <th>Username</th>
        <th>Email</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>{user.username}</td>
          <td>{user.email}</td>
          <td>
            <UserActionButtons onDelete={() => onDeleteUser(user.id)} />
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default UserManagementTable;
