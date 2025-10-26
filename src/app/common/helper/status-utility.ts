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
