import { ServerCommonSchemaInterface } from '@config-runtime/schemas/common';



/**
 * Validates the SSL configuration in the server common schema.
 * If SSL is enabled, both cert and key must be provided.
 *
 * @param {ServerCommonSchemaInterface} input - The server common schema to validate.
 * @throws {Error} If only one of cert or key is provided.
 */
export function validate(input: ServerCommonSchemaInterface): void {
  if (input.http.ssl) {
    if (
      (!input.http.ssl.cert || !input.http.ssl.key) &&
      (input.http.ssl.cert || input.http.ssl.key)
    ) {
      throw new Error('Both cert and key files must be provided for SSL');
    }
  }
}
