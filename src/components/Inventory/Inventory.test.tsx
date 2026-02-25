
jest.mock('../../consts', () => require('../../mocks/consts'))
import { initInventoryItems } from "../../mocks/data";
import { screen, waitFor } from '@testing-library/react';
import { renderWithProvider as render } from '../../test-utils';
import Inventory from '../../components/Inventory/Inventory';
import { useGetInventoryItemsQuery } from "../../services/inventory-service";
import { useGridActions, useGridState } from '../../hooks/useGrid';

jest.mock('../../hooks/useGrid', () => ({
    useGridActions: jest.fn(),
    useGridState: jest.fn(),
}));

jest.mock('../../services/inventory-service', () => ({
    inventoryApi: {
        endpoints: {
            getInventoryItems: {
                select: jest.fn().mockReturnValue(() => ({
                    data: {
                        entites: initInventoryItems
                    }
                })),
            },
        },
    },
    useGetInventoryItemsQuery: jest.fn() as jest.Mock,
}));

const mockInventoryResponses = {
    success: {
        data: initInventoryItems,
        isSuccess: true,
        isLoading: false,
        isError: false,
        error: null,
    },
    loading: {
        data: null,
        isSuccess: false,
        isLoading: true,
        isError: false,
        error: null,
    },
    error: {
        data: null,
        isSuccess: false,
        isLoading: false,
        isError: true,
        error: { status: 500, data: { message: 'Ошибка загрузки' } },
    },
};


jest.mock('../../hooks/useGrid', () => ({
    useGridActions: () => ({
        registerGrid: jest.fn().mockReturnValue(jest.fn()),
    }),
    useGridState: () => ({
        activeItem: null,
        dropArea: null,
    }),
}));



describe('Inventory Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should render inventory after successfull Items fetch', async () => {
        (useGetInventoryItemsQuery as jest.Mock).mockReturnValue(
            mockInventoryResponses.success
        );
        render(<Inventory />);

        expect(screen.getByText('Inventory')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByTestId(/grid-area-inv/)).toBeInTheDocument();
        });
    });

    test('should show loader', () => {
        (useGetInventoryItemsQuery as jest.Mock).mockReturnValue(
            mockInventoryResponses.loading
        );
        render(<Inventory />);
        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    test('should show error', async () => {
        (useGetInventoryItemsQuery as jest.Mock).mockReturnValue(
            mockInventoryResponses.error
        );
        render(<Inventory />);

        await waitFor(() => {
            expect(screen.getByTestId(/error-msg/i)).toBeInTheDocument();
        });
    });

    test('register grid with the right ID', () => {
        
        const mockRegisterGridCreator = jest.fn().mockReturnValue(() => "mock-ref-setter");
    
        (useGridActions as jest.Mock).mockReturnValue({
            registerGrid: mockRegisterGridCreator,
        });

        (useGridState as jest.Mock).mockReturnValue({
            activeItem: null,
            dropArea: null,
        });

        render(<Inventory />);

        expect(mockRegisterGridCreator).toHaveBeenCalledWith('inv'); 
    });
});
