/**
 * Utility class for task and case status related operations
 */
export class StatusUtility {

  /**
   * Returns the appropriate Bootstrap badge class for a given task status
   * @param status - The task status (e.g., 'completed', 'in progress', 'cancelled', 'open')
   * @returns Bootstrap badge class string
   */
  static getStatusBadgeClass(status: string | undefined): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'badge bg-success';
      case 'in progress':
        return 'badge bg-primary';
      case 'cancelled':
        return 'badge bg-danger';
      case 'open':
        return 'badge bg-secondary';
      default:
        return 'badge bg-secondary';
    }
  }

  /**
   * Bootstrap badge class for a CASE status. Kept apart from getStatusBadgeClass because the
   * two vocabularies differ: a case is 'OPEN'/'CLOSED', a task is 'open'/'in progress'/...,
   * and a task's 'open' is deliberately muted while an open case should stand out.
   *
   * @param caseStatus 'OPEN', 'CLOSED', or undefined when the client has no case at all
   */
  static getCaseStatusBadgeClass(caseStatus: string | undefined): string {
    switch (caseStatus) {
      case 'OPEN':
        return 'badge bg-success';
      case 'CLOSED':
        return 'badge bg-secondary';
      default:
        return 'badge bg-light text-dark border';
    }
  }

  /** German label for a case status; undefined means the client has no case yet. */
  static getCaseStatusLabel(caseStatus: string | undefined): string {
    switch (caseStatus) {
      case 'OPEN':
        return 'offen';
      case 'CLOSED':
        return 'abgeschlossen';
      default:
        return 'kein Fall';
    }
  }

  /**
   * Returns all available task statuses
   */
  static getAvailableStatuses(): string[] {
    return ['Open', 'In Progress', 'Completed', 'Cancelled'];
  }

  /**
   * Checks if a status is valid
   * @param status - The status to validate
   */
  static isValidStatus(status: string): boolean {
    const validStatuses = this.getAvailableStatuses().map(s => s.toLowerCase());
    return validStatuses.includes(status.toLowerCase());
  }

}
