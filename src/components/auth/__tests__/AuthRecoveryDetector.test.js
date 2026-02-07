import { render } from '@testing-library/react';
import AuthRecoveryDetector from '../AuthRecoveryDetector';
import { supabase } from '@/lib/supabase';

// Helper to get the mock function
const getMockOnAuthStateChange = () => {
    return require('@/lib/supabase').supabase.auth.onAuthStateChange;
};

// Define mocks
const mockPush = jest.fn();
const mockSearchParams = { get: jest.fn() };
const mockUnsubscribe = jest.fn();

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
    useSearchParams: () => mockSearchParams
}));

// Mock Supabase
jest.mock('@/lib/supabase', () => {
    const mockUnsubscribe = jest.fn();
    const mockOnAuthStateChange = jest.fn(() => ({
        data: { subscription: { unsubscribe: mockUnsubscribe } }
    }));
    return {
        supabase: {
            auth: {
                onAuthStateChange: mockOnAuthStateChange,
                getSession: jest.fn().mockResolvedValue({ data: { session: null } })
            }
        }
    };
});

describe('AuthRecoveryDetector', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockPush.mockClear();
        const onAuthStateChange = getMockOnAuthStateChange();
        onAuthStateChange.mockClear();
        // Ensure default return value
        onAuthStateChange.mockReturnValue({
            data: { subscription: { unsubscribe: mockUnsubscribe } }
        });
    });

    it('redirects when PASSWORD_RECOVERY event is received', () => {
        render(<AuthRecoveryDetector />);

        const onAuthStateChange = getMockOnAuthStateChange();
        // Get the callback passed to onAuthStateChange
        const authCallback = onAuthStateChange.mock.calls[0][0];

        // Simulate the event
        authCallback('PASSWORD_RECOVERY', {});

        expect(mockPush).toHaveBeenCalledWith('/auth/reset-password');
    });

    it('redirects when SIGNED_IN event happens closely after recovery_sent_at', () => {
        render(<AuthRecoveryDetector />);
        const onAuthStateChange = getMockOnAuthStateChange();
        const authCallback = onAuthStateChange.mock.calls[0][0];

        const now = Date.now();
        const session = {
            user: {
                recovery_sent_at: new Date(now - 10000).toISOString(), // 10 seconds ago
                last_sign_in_at: new Date(now).toISOString()
            }
        };

        authCallback('SIGNED_IN', session);

        expect(mockPush).toHaveBeenCalledWith('/auth/reset-password');
    });

    it('does NOT redirect if recovery_sent_at was long ago', () => {
        render(<AuthRecoveryDetector />);
        const onAuthStateChange = getMockOnAuthStateChange();
        const authCallback = onAuthStateChange.mock.calls[0][0];

        const now = Date.now();
        const session = {
            user: {
                recovery_sent_at: new Date(now - 300000).toISOString(), // 5 minutes ago (limit is 2m)
                last_sign_in_at: new Date(now).toISOString()
            }
        };

        authCallback('SIGNED_IN', session);

        expect(mockPush).not.toHaveBeenCalled();
    });
});
