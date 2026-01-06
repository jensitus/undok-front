// resource-state.model.ts
export interface LoadingState {
  state: 'loading';
}

export interface SuccessState<T> {
  state: 'success';
  data: T;
}

export interface ErrorState {
  state: 'error';
  error: string;
}

export type ResourceState<T> = LoadingState | SuccessState<T> | ErrorState;

// Optional: Type guard helpers
export function isLoading<T>(state: ResourceState<T>): state is LoadingState {
  return state.state === 'loading';
}

export function isSuccess<T>(state: ResourceState<T>): state is SuccessState<T> {
  return state.state === 'success';
}

export function isError<T>(state: ResourceState<T>): state is ErrorState {
  return state.state === 'error';
}
