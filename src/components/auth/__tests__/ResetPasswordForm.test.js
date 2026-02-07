import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResetPasswordForm from '../ResetPasswordForm';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

// Mocks
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
    useSearchParams: () => ({ get: jest.fn() })
}));

jest.mock('@/lib/supabase', () => {
    const mockUpdateUser = jest.fn();
    return {
        supabase: {
            auth: {
                updateUser: mockUpdateUser,
                exchangeCodeForSession: jest.fn().mockResolvedValue({ error: null }),
                getSession: jest.fn().mockResolvedValue({
                    data: { session: { user: { id: '123' } } }
                }),
                onAuthStateChange: jest.fn(() => ({
                    data: { subscription: { unsubscribe: jest.fn() } }
                }))
            }
        }
    };
});

// Helper to get mock function
const getMockUpdateUser = () => require('@/lib/supabase').supabase.auth.updateUser;

// Mock timer functions
jest.useFakeTimers();

describe('ResetPasswordForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders password inputs', async () => {
        render(<ResetPasswordForm />);

        await waitFor(() => {
            expect(screen.queryByText('Verificando sesión...')).not.toBeInTheDocument();
        });

        expect(screen.getByLabelText('Nueva contraseña')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirmar contraseña')).toBeInTheDocument();
    });

    it('validates matching passwords', async () => {
        render(<ResetPasswordForm />);

        await waitFor(() => expect(screen.queryByText('Verificando sesión...')).not.toBeInTheDocument());

        fireEvent.change(screen.getByLabelText('Nueva contraseña'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'password456' } });

        fireEvent.click(screen.getByText('Actualizar contraseña'));

        expect(screen.getByText('Las contraseñas no coinciden.')).toBeInTheDocument();
    });

    it('calls updateUser when passwords match', async () => {
        const mockUpdateUser = getMockUpdateUser();
        mockUpdateUser.mockResolvedValueOnce({ error: null, data: {} });

        render(<ResetPasswordForm />);

        await waitFor(() => expect(screen.queryByText('Verificando sesión...')).not.toBeInTheDocument());

        fireEvent.change(screen.getByLabelText('Nueva contraseña'), { target: { value: 'newpassword123' } });
        fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'newpassword123' } });

        fireEvent.click(screen.getByText('Actualizar contraseña'));

        await waitFor(() => {
            expect(mockUpdateUser).toHaveBeenCalledWith({
                password: 'newpassword123'
            });
        });

        await waitFor(() => {
            expect(screen.getByText(/¡Contraseña actualizada con éxito!/i)).toBeInTheDocument();
        });
    });
});
