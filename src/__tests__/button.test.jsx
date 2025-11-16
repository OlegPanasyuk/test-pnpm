import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../button';

describe('Button', () => {
  it('renders provided label text', () => {
    render(<Button>Submit</Button>);

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('triggers click handler when pressed', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Press me</Button>);

    await user.click(screen.getByRole('button', { name: /press me/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('respects the disabled state', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();

    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>
    );

    const button = screen.getByRole('button', { name: /disabled/i });

    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
