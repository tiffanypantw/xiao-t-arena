import { QueryClient } from '@tanstack/react-query';


export const queryClientInstance = new QueryClient({
	defaultOptions: {
		queries: {
			// 切回分頁時自動 refetch（admin 編完內容、學員那 tab 切回來時看到新值）
			refetchOnWindowFocus: true,
			retry: 1,
		},
	},
});