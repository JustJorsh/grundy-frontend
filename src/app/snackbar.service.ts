import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  /**
   * Opens a generic snackbar message.
   * @param message The message to display.
   * @param duration Duration in milliseconds (defaults to 3000ms).
   * @param action Action button text (defaults to 'Close').
   */
  open(message: string, duration: number = 3000, action: string = 'Close'): void {
    this.snackBar.open(message, action, {
      duration: duration,
    });
  }

  /**
   * Opens a snackbar with success styling.
   * @param message The success message.
   * @param duration Duration in milliseconds (defaults to 3000ms).
   */
  success(message: string, duration: number = 3000): void {
    const config: MatSnackBarConfig = {
      duration: duration,
      panelClass: ['snackbar-success'],
      horizontalPosition: "center",
      verticalPosition: "top", // Custom CSS class for styling
    };
    this.snackBar.open(message, 'Close', config);
  }

  /**
   * Opens a snackbar with error styling.
   * @param message The error message.
   * @param duration Duration in milliseconds (defaults to 3000ms).
   */
  error(message: string, duration: number = 3000): void {
    const config: MatSnackBarConfig = {
      duration: duration,
      panelClass: ['snackbar-error'], // Custom CSS class for styling
    };
    this.snackBar.open(message, 'Close', config);
  }
}
