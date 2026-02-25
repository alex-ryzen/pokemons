
jest.mock('../../consts', () => require('../../mocks/consts'))
import { initShopItems } from "../../mocks/data";
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProvider as render, userEvent } from '../../test-utils';
import { useObserver } from '../../hooks/useObserver';
import { IShopItem } from "../../types/app";
import { useGetShopItemsInfiniteQuery } from '../../services/shop-service';
import Shop from '../../components/Shop/Shop';

jest.mock('../../services/shop-service', () => ({
    gardenApi: {
        endpoints: {
            getGradenBerries: {
                select: jest.fn().mockReturnValue(() => ({
                    data: {
                        entites: initShopItems
                    }
                })),
            },
        },
    },
    useGetShopItemsInfiniteQuery: jest.fn(),
}));

const mockShopResponses = {
    success: {
        data: {
            pages: [
                {
                    items: initShopItems,
                    total: 2,
                },
            ],
        },
        isSuccess: true,
        isError: false,
        isLoading: false,
        isFetching: false,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
    },

    loading: {
        data: null,
        isSuccess: false,
        isError: false,
        isLoading: true,
        isFetching: true,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
    },

    error: {
        data: null,
        isSuccess: false,
        isError: true,
        isLoading: false,
        isFetching: false,
        error: { status: 500 },
        fetchNextPage: jest.fn(),
        hasNextPage: false,
    },

    withPagination: {
        data: {
            pages: [
                {
                    items: new Array<IShopItem>(initShopItems[1]),
                    total: 1,
                },
                {
                    items: new Array<IShopItem>(initShopItems[2]),
                    total: 1,
                },
            ],
        },
        isSuccess: true,
        isError: false,
        isLoading: false,
        isFetching: false,
        fetchNextPage: jest.fn(),
        hasNextPage: true,
    },
};

jest.mock('../../hooks/useObserver', () => ({
    useObserver: jest.fn(),
}));

describe('Shop Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useObserver as jest.Mock).mockImplementation(() => { });
    });

    test('should render the Shop after successfull Items fetch', async () => {
        (useGetShopItemsInfiniteQuery as jest.Mock).mockReturnValue(
            mockShopResponses.success
        );

        render(<Shop />);

        expect(screen.getByText('Shop')).toBeInTheDocument();
        expect(screen.getByText('Тип товара')).toBeInTheDocument();
        expect(screen.getByLabelText('Покеболлы')).toBeInTheDocument();
        expect(screen.getByLabelText('Ягоды')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('master-ball 1 уровня')).toBeInTheDocument();
        });

        const buyButtons = screen.getAllByText(/Купить за/);
        expect(buyButtons).toHaveLength(2);
        expect(buyButtons[0]).toHaveTextContent('Купить за 1000');
    });

    test('should show loader', () => {
        (useGetShopItemsInfiniteQuery as jest.Mock).mockReturnValue(
            mockShopResponses.loading
        );

        render(<Shop />);

        expect(screen.getByTestId('loading')).toBeInTheDocument();
        expect(screen.queryByText('master-ball')).not.toBeInTheDocument();
    });

    test('should show error', async () => {
        (useGetShopItemsInfiniteQuery as jest.Mock).mockReturnValue(
            mockShopResponses.error
        );
        render(<Shop />);
        await waitFor(() => {
            expect(screen.getByText(/error/i)).toBeInTheDocument();
        });
        expect(screen.queryByText('Покеболл')).not.toBeInTheDocument();
    });

    test('should filter items when the Shop Filter has changed', async () => {
        const user = userEvent.setup();

        (useGetShopItemsInfiniteQuery as jest.Mock).mockReturnValue(
            mockShopResponses.success
        );

        render(<Shop />);

        await waitFor(() => {
            expect(screen.getByText('Покеболл 1 уровня')).toBeInTheDocument();
        });

        const pokeballCheckbox = screen.getByLabelText('Покеболлы');
        await user.click(pokeballCheckbox);

        expect(useGetShopItemsInfiniteQuery).toHaveBeenCalledWith({
            filter: expect.any(String),
            sort: 'updatedAt-ASC',
            limit: expect.any(Number),
        });
    });

    test('should sort the items when the Sort Options has been selected', async () => {
        const user = userEvent.setup();

        (useGetShopItemsInfiniteQuery as jest.Mock).mockReturnValue(
            mockShopResponses.success
        );

        render(<Shop />);

        await waitFor(() => {
            expect(screen.getByText('master-ball 1 уровня')).toBeInTheDocument();
        });

        const sortSelect = screen.getByRole('combobox');
        await user.click(sortSelect);

        const priceOption = screen.getByText('Цена - возр.');
        await user.click(priceOption);

        expect(useGetShopItemsInfiniteQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                sort: 'price-ASC',
            })
        );
    });

    test('should fetch more products while scrolling', async () => {
        const fetchNextPageMock = jest.fn();

        (useGetShopItemsInfiniteQuery as jest.Mock).mockReturnValue({
            ...mockShopResponses.withPagination,
            fetchNextPage: fetchNextPageMock,
        });

        (useObserver as jest.Mock).mockImplementation(({ callback }) => {
            React.useEffect(() => {
                callback();
            }, [callback]);
        });

        render(<Shop />);

        await waitFor(() => {
            expect(fetchNextPageMock).toHaveBeenCalled();
        });
    });

    test('should show descriptions of products properly', async () => {
        (useGetShopItemsInfiniteQuery as jest.Mock).mockReturnValue(
            mockShopResponses.success
        );
        render(<Shop />);
        await waitFor(() => {
            expect(screen.getByText(/Во время охоты ловит покемона с шансом 70%/)).toBeInTheDocument();
        });
    });
});