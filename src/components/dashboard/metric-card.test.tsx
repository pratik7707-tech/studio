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

  it('renders the icon', () => {
    render(<MetricCard title="Test" value="123" icon={Wallet} />);
    
    // The icon itself doesn't have text, but we can check if its container is rendered.
    // The icon is an SVG, so we can check for its presence.
    const icon = screen.getByText('Test').parentElement?.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    const description = "This is a test description";
    render(<MetricCard title="Test" value="123" icon={Wallet} description={description} />);

    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('does not render the description when not provided', () => {
    const description = "This is a test description";
    const { queryByText } = render(<MetricCard title="Test" value="123" icon={Wallet} />);

    expect(queryByText(description)).not.toBeInTheDocument();
  });
});
