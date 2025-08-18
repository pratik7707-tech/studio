
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MetricCard } from './metric-card';
import { Wallet } from 'lucide-react';

describe('MetricCard', () => {
  it('renders the title and value correctly', () => {
    const title = "Test Title";
    const value = "$1,234.56";

    render(<MetricCard title={title} value={value} icon={Wallet} />);

    // Check if the title is in the document
    expect(screen.getByText(title)).toBeInTheDocument();

    // Check if the value is in the document
    expect(screen.getByText(value)).toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    const description = "Test Description";
    render(<MetricCard title="Title" value="Value" icon={Wallet} description={description} />);
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('applies custom valueClassName', () => {
    const valueClassName = "text-red-500";
    render(<MetricCard title="Title" value="Value" icon={Wallet} valueClassName={valueClassName} />);
    const valueElement = screen.getByText("Value");
    expect(valueElement).toHaveClass(valueClassName);
  });
});
