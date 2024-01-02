import crypto from 'crypto'

type AnyObject = {
  [key: string]: any
}

/**
 @description Retrieves a key from an object that corresponds to a given value in an enumeration.
 @template T The type of the enumeration value (string or number)
 @param enumObj The object that contains the enumeration values
 @param enumValue The value to search for in the enumeration
 @return The key that corresponds to the given value, or undefined if not found
*/

export const getKeyByValue = <T extends string | number>(enumObj: any, enumValue: T): string | undefined => {
  return Object.keys(enumObj).find((key) => enumObj[key] === enumValue)
}

/**
 * Removes specified keys from an object
 * @param obj - The object from which keys should be removed
 * @param keys - An array of keys to remove from the object
 * @returns A new object with specified keys removed
 */
export const removeKeysFromObject = (obj: AnyObject, keys: string[]): AnyObject => {
  const newObj = { ...obj }

  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(newObj, key)) {
      delete newObj[key] // Remove the key from the object
    }
  })

  return newObj
}

/**
 * Generate a unique and secure OTP (One-Time Password) using both digits and letters.
 *
 * @param length - Length of the OTP to be generated (default is 6 characters).
 * @returns A unique and secure OTP.
 */
export const generateSecureOTP = (length: number = 6): string => {
  // Define the characters that will be used to generate the OTP
  const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const charactersLength: number = characters.length
  let otp: string = ''

  // Loop to generate the OTP using a cryptographically secure random number generator
  for (let i = 0; i < length; i++) {
    // Generate a random index within the range of characters
    const randomIndex: number = crypto.randomInt(0, charactersLength)

    // Append the character at the random index to the OTP string
    otp += characters.charAt(randomIndex)
  }

  // Return the generated OTP
  return otp
}

/**
 * Generate a random token using crypto.randomBytes.
 * @returns {string} - Random token string.
 */
export const generateRandomToken = (): string => {
  try {
    // Generate a random buffer of 20 bytes
    const buffer = crypto.randomBytes(20)

    // Convert the buffer to a hexadecimal string
    const token = buffer.toString('hex')

    return token
  } catch (error) {
    throw new Error('Failed to generate random token.')
  }
}
