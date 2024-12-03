// src/components/molecules/AdminForm.js
import React from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

const AdminForm = ({ value, onChange, onSubmit, placeholder, buttonText }) => (
  <form onSubmit={onSubmit} className="mb-3">
    <Input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="me-2"
    />
    <Button type="submit" className="btn btn-primary mt-2">
      {buttonText}
    </Button>
  </form>
);

export default AdminForm;
