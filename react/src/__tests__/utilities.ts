import { render as renderComponent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export function render(
    ui: React.ReactElement,
    options?: Parameters<typeof renderComponent>[1],
) {
    const result = renderComponent(ui, options);

    return {
        ...result,
        user: userEvent.setup(),
    };
}
