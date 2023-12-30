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
