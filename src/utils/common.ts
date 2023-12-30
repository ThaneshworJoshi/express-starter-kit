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
