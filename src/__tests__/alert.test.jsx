import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Alert from '../alert';

const getAlert = () => screen.getByRole('alert');

describe('Alert', () => {
  it('renders title and message content', () => {
    render(
      <Alert title="Heads up!">
        Something descriptive goes here.
      </Alert>
    );

    expect(getAlert()).toBeInTheDocument();
    expect(screen.getByText('Heads up!')).toBeInTheDocument();
    expect(screen.getByText('Something descriptive goes here.')).toBeInTheDocument();
  });

  it('falls back to info variant styles when an unknown variant is provided', () => {
    render(
      <Alert variant="unknown">
        Mystery variant
      </Alert>
    );

    const alert = getAlert();

    expect(alert).toHaveStyle({ backgroundColor: '#eff6ff' });
  });

  it('supports custom icons and hides the default one', () => {
    render(
      <Alert icon="🚀" title="Lift off">
        Launch initiated
      </Alert>
    );

    expect(screen.getByText('🚀')).toBeInTheDocument();
    expect(screen.queryByText('ℹ️')).not.toBeInTheDocument();
  });

  it('renders dismiss button when dismissible and triggers callback', async () => {
    const onDismiss = jest.fn();
    const user = userEvent.setup();

    render(
      <Alert dismissible onDismiss={onDismiss}>
        Close me
      </Alert>
    );

    const dismissButton = screen.getByRole('button', { name: /dismiss alert/i });

    expect(dismissButton).toBeInTheDocument();

    await user.click(dismissButton);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not render dismiss button when not dismissible', () => {
    render(<Alert>Static alert</Alert>);

    expect(screen.queryByRole('button', { name: /dismiss alert/i })).toBeNull();
  });
});
