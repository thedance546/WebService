// src/features/Admin/DashboardCard.js
import React from 'react';
import { Card } from 'react-bootstrap';
import Button from '../../components/atoms/Button';

const DashboardCard = ({ title, text, buttonText, onClick }) => (
  <Card className="mb-3">
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Card.Text>{text}</Card.Text>
      <Button onClick={onClick} className="btn btn-primary">
        {buttonText}
      </Button>
    </Card.Body>
  </Card>
);

export default DashboardCard;
