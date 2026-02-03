import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadForm from '@/components/gente/UploadForm';

// Mock useRouter
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock useAuth
jest.mock('@/context/AuthContext', () => ({
    useAuth: () => ({
        user: {
            user_metadata: { display_name: 'TestUser' },
            email: 'test@example.com'
        },
        loading: false,
    }),
}));

describe('UploadForm Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.alert = jest.fn();
    });

    it('renders all form fields', () => {
        render(<UploadForm onSubmit={jest.fn()} />);

        expect(screen.getByLabelText(/^Foto$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Evento/i)).toBeInTheDocument();
        expect(screen.getByText(/@TestUser/i)).toBeInTheDocument();
    });

    it('shows validation alert if file is missing', async () => {
        const mockOnSubmit = jest.fn();

        render(<UploadForm onSubmit={mockOnSubmit} />);

        const form = screen.getByRole('form');
        fireEvent.submit(form);

        expect(window.alert).toHaveBeenCalledWith('Por favor selecciona una foto.');
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('handles submission correctly', async () => {
        const mockOnSubmit = jest.fn().mockResolvedValue({ success: true });
        const mockCompress = jest.fn((file) => Promise.resolve(file));

        render(<UploadForm onSubmit={mockOnSubmit} compressImage={mockCompress} />);

        // Mock file selection
        const file = new File(['test'], 'test.png', { type: 'image/png' });
        const fileInput = screen.getByLabelText(/^Foto$/i);

        fireEvent.change(fileInput, { target: { files: [file] } });

        fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: 'Test Caption' } });
        fireEvent.change(screen.getByLabelText(/Evento/i), { target: { value: 'Test Event' } });

        const form = screen.getByRole('form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(mockCompress).toHaveBeenCalled();
            expect(mockOnSubmit).toHaveBeenCalled();
        });
    });
});
