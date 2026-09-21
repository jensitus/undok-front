export interface CloseCaseForm {
  /** ISO yyyy-MM-dd — the backend binds this to a LocalDate. */
  endDate: string;
  referredTo?: string;
}
