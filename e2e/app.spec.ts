import { expect, test } from '@playwright/test';

test('allows adding, editing and deleting tasks', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: '¿Qué tienes pendiente?' })).toBeVisible();
  await expect(page.getByText('Aún no tienes tareas')).toBeVisible();

  const titleInput = page.locator('ion-input input');
  const descriptionInput = page.locator('ion-textarea textarea');
  const submitButton = page.locator('ion-button[type="submit"]');

  await titleInput.fill('   ');
  await descriptionInput.fill('   ');
  await expect(submitButton).toHaveClass(/button-disabled/);

  await titleInput.fill('Study Ionic');
  await descriptionInput.fill('Review components and forms');
  await submitButton.click();

  await expect(page.locator('.task-item h2')).toHaveText('Study Ionic');
  await expect(page.locator('.task-item p')).toHaveText('Review components and forms');
  await expect(page.locator('.task-counter')).toHaveText('1');

  await page.locator('.task-actions ion-button').first().click();

  await expect(page.locator('#page-heading')).toHaveText('Edita tu tarea');
  await expect(titleInput).toHaveValue('Study Ionic');
  await expect(descriptionInput).toHaveValue('Review components and forms');

  await titleInput.fill('Study Ionic and Angular');
  await submitButton.click();

  await expect(page.locator('.task-item h2')).toHaveText('Study Ionic and Angular');
  await expect(page.locator('#page-heading')).toHaveText('¿Qué tienes pendiente?');

  await page.locator('.task-actions ion-button').last().click();

  await expect(page.locator('ion-alert')).toContainText('¿Seguro que quieres eliminar');
  await page.locator('ion-alert .alert-button', { hasText: 'Eliminar' }).click();

  await expect(page.locator('.empty-state')).toBeVisible();
  await expect(page.locator('.task-counter')).toHaveText('0');
});
