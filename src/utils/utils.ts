import { ICitations } from '@/models/base-message'
import { CrawlerSettingsGroupRawValue, TransformedData, TransformedGrouped } from '@/types/url-crawler'
// noinspection JSUnusedGlobalSymbols

import {
  AbstractControl,
  FormArray,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroup,
  NgModel,
  ValidationErrors,
} from '@angular/forms'
import { UrlTree, NavigationEnd, DefaultUrlSerializer, UrlSegment } from '@angular/router'
import {
  catchError,
  filter,
  map,
  MonoTypeOperatorFunction,
  Observable,
  of,
  OperatorFunction,
  pairwise,
  startWith,
} from 'rxjs'

export function markAllControlsAsTouchedAndDirty(control: AbstractControl) {
  const markRecursive = (control: AbstractControl): void => {
    if (control instanceof FormGroup) {
      Object.values(control.controls).forEach(childControl => {
        markRecursive(childControl)
      })
    } else if (control instanceof FormArray) {
      control.controls.forEach(childControl => {
        markRecursive(childControl)
      })
    } else if (control instanceof FormControl) {
      control.markAsTouched()
      control.markAsDirty()
    }
  }

  markRecursive(control)
}
/**
 * to check if the NgControl is NgModel
 * @param control
 */
export function isNgModel(control: unknown): control is NgModel {
  return control instanceof NgModel
}

/**
 * to check if the NgControl is FormControlDirective
 * @param control
 */
export function isFormControlDirective(control: unknown): control is FormControlDirective {
  return control instanceof FormControlDirective
}

/**
 * to check if the NgControl is FormControlName
 * @param control
 */
export function isFormControlName(control: unknown): control is FormControlName {
  return control instanceof FormControlName
}

/**
 * operator to ignore the errors came from observable and keep it a live
 * @param debug just to console log the error
 */
export function ignoreErrors<T>(debug = false): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => {
    return source
      .pipe(
        catchError(error => {
          debug && console.log(error)
          return of('CUSTOM_ERROR' as T)
        })
      )
      .pipe(filter<T>((value): value is T => value !== 'CUSTOM_ERROR'))
  }
}

function getPrimaryPath(url: string): string {
  const serializer = new DefaultUrlSerializer()
  const parsed: UrlTree = serializer.parse(url)
  const segments: UrlSegment[] = parsed.root.children['primary']?.segments || []
  return '/' + segments.map(s => s.path).join('/')
}
export function ignoreQueryAndFragmentChange<T extends 'event' | 'path'>(options: {
  emit: T
}): OperatorFunction<NavigationEnd, T extends 'event' ? NavigationEnd : string> {
  return ((source$: Observable<NavigationEnd>) =>
    source$.pipe(
      map(e => ({ event: e, path: getPrimaryPath(e.urlAfterRedirects) })),
      startWith({ event: {} as NavigationEnd, path: '' }),
      pairwise(),
      filter(([prev, curr]) => prev.path !== curr.path),
      map(
        ([, curr]) => (options.emit === 'path' ? curr.path : curr.event) as T extends 'event' ? NavigationEnd : string
      )
    )) as OperatorFunction<NavigationEnd, T extends 'event' ? NavigationEnd : string>
}
/**
 * chunk provided array by given bulk size
 * @param arr
 * @param bulkSize
 */
export function arrayChunk<T>(arr: T[], bulkSize = 3): T[][] {
  const bulks: T[][] = []
  for (let i = 0; i < Math.ceil(arr.length / bulkSize); i++) {
    bulks.push(arr.slice(i * bulkSize, (i + 1) * bulkSize))
  }
  return bulks
}

/**
 * @description Generates the html ordered list of passed string values
 * @param title
 * @param namesList
 */
export function generateHtmlList(title: string, namesList: string[]): HTMLDivElement {
  const div = document.createElement('div')
  div.classList.add('dynamic-list-container')

  const titleElement = document.createElement('h6')
  titleElement.innerText = title

  const list: HTMLOListElement = document.createElement('ol')
  for (const name of namesList) {
    const item = document.createElement('li')
    item.appendChild(document.createTextNode(name))
    list.appendChild(item)
  }

  div.append(titleElement)
  div.append(list)
  return div
}

/**
 * @description Opens the blob data in new browser tab or download if IE browser
 * @param data
 * @param fileName
 */
export function printBlobData(data: Blob, fileName?: string): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window.navigator as any).msSaveOrOpenBlob) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window.navigator as any).msSaveOrOpenBlob(data, fileName ?? 'customs-' + new Date().valueOf() + '.pdf')
  } else {
    const a: HTMLAnchorElement = document.createElement('a')
    const url = URL.createObjectURL(data)
    a.href = URL.createObjectURL(data)
    a.target = '_blank'
    a.click()

    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 0)
  }
}

/**
 * @description Checks if given value is valid
 * @param value
 * Value to check for validity
 */
export function isValidValue(value: unknown): boolean {
  return typeof value === 'string' ? value.trim() !== '' : typeof value !== 'undefined' && value !== null
}

/**
 * @description has valida length
 * @param value
 */
export function hasValidLength(value: unknown): boolean {
  if (!isValidValue(value)) {
    return false
  }
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * @description Checks if given object is empty(not having properties)
 * @param objectToCheck
 * Object to check for emptiness
 */
export function isEmptyObject(objectToCheck: object): boolean {
  for (const key in objectToCheck) {
    if (Object.prototype.hasOwnProperty.call(objectToCheck, key)) {
      return false
    }
  }
  return true
}

/**
 * @description Check if object has any property with value
 * @param objectToCheck
 * Object to check for property values
 */
export function objectHasValue(objectToCheck: object): boolean {
  return Object.values(objectToCheck).some(value => isValidValue(value))
}

export function objectHasOwnProperty<O, P extends PropertyKey>(
  object: O,
  property: P
): object is O & Record<P, unknown> {
  return Object.prototype.hasOwnProperty.call(object, property)
}

export function generateUUID() {
  // Public Domain/MIT
  let d = new Date().getTime() //Timestamp
  //Time in microseconds since page-load or 0 if unsupported
  let d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function* generateChunks<T>(arr: T[], n: number): Generator<T[], void> {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n)
  }
}

export function chunks<T>(arr: T[], n: number): T[][] {
  return [...generateChunks(arr, n)]
}

export const range = (start: number, stop: number) => Array.from({ length: stop - start + 1 }, (_, i) => start + i)

export function isRTL(str: string) {
  return /[\u0600-\u06FF]+/.test(str)
}
export const formatString = (text: string) => {
  text
    .split(' ')
    .map(word => (isRTL(word) ? '\u202A' : '\u202C') + word)
    .join(' ')
  return text
}

export function formatText<T extends { context: { citations: ICitations[] } }>(text: string, message?: T): string {
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  if (!message?.context) {
    return formattedText.trim()
  }
  const citations = message.context?.citations ?? []
  // Remove duplicate citations by URL and title
  const uniqueCitations = Array.from(new Map(citations.map(item => [item.url + item.title, item])).values())

  // Keep track of already replaced citations to prevent duplicate replacements
  const replacedCitations = new Set<string>()

  // Replace text between [ and ] with <a> tags
  formattedText = formattedText.replace(/\[(.*?)\]/g, (match, p1) => {
    const index = Number(p1.replace(/[^0-9]/g, '')) - 1
    const item = uniqueCitations[index]
    const title = item?.title
    const url = item?.url ? decodeURIComponent(item.url) : item?.ref_url ? decodeURIComponent(item.ref_url) : ''

    if (!url || !title || replacedCitations.has(url + title)) {
      return ''
    }

    replacedCitations.add(item.url + item.title) // Mark citation as replaced

    // eslint-disable-next-line max-len
    return `<br /><small class="px-1 text-primary"><a target="_blank" href="${decodeURIComponent(url)}">${title}</a><i class="link-icon"></i></small>`
  })

  // Return the formatted text
  return formattedText.trim()
}

export function convertMarkdownToHtmlHeaders(content: string): string {
  // Regex to match markdown headers
  const headerRegex = /^(#+)\s+(.*)$/gm

  return content.replace(headerRegex, (_, hashes, text) => {
    const level: number = hashes.length // Determine the header level (number of #)

    // Define Tailwind classes for each header level
    const headerClasses: Record<number, string> = {
      1: 'text-2xl font-bold ml-9', // H1 - Large and bold
      2: 'text-xl font-bold', // H2 - Slightly smaller and bold
      3: 'text-lg font-bold', // H3 - Medium size and bold
      4: 'text-base font-bold', // H4 - Smaller but bold
      5: 'text-sm font-semibold', // H5 - Small and semi-bold
      6: 'text-xs font-medium', // H6 - Smallest and medium weight
    }

    const classes = headerClasses[level] || 'text-base font-medium' // Default classes

    return `<h${level} class="${classes}">${text}</h${level}>` // Replace with HTML + Tailwind classes
  })
}

export function extractFileName(url: string) {
  const urlObj = new URL(url)
  const pathName = urlObj.pathname
  const fileName = decodeURI(pathName.split('/').pop() || 'file')
  return fileName
}

export function transformKeyValueArrayToObject(arr: { key: string; value: string }[]): Record<string, string> {
  return arr.reduce(
    (acc, { key, value }) => {
      acc[key] = value
      return acc
    },
    {} as Record<string, string>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isCrawlUrl(data: any): data is CrawlerSettingsGroupRawValue[] {
  return Array.isArray(data) && 'crawl_settings' in data[0] && typeof data === 'object'
}

// Enhanced version of the transformData function
export function transformData<TData extends TransformedGrouped>(input: TData): TransformedData<TData> {
  if (isCrawlUrl(input)) {
    return input.flatMap(crawlUrl => ({
      ...crawlUrl,
      crawl_settings: {
        ...crawlUrl.crawl_settings,
        urls: crawlUrl.crawl_settings.urls.map(url => ({
          ...url,
          headers: url.headers ? transformKeyValueArrayToObject(url.headers) : {},
          cookies: url.cookies ? transformKeyValueArrayToObject(url.cookies) : {},
          payload: url.payload ? transformKeyValueArrayToObject(url.payload) : {},
        })),
      },
    })) as unknown as TransformedData<TData>
    // Explicit type assertion due to TypeScript's structural type system
  } else {
    // Input is of type UrlGroupRawValue
    return {
      ...input,
      headers: input.headers ? transformKeyValueArrayToObject(input.headers) : {},
      cookies: input.cookies ? transformKeyValueArrayToObject(input.cookies) : {},
      payload: input.payload ? transformKeyValueArrayToObject(input.payload) : {},
    } as unknown as TransformedData<TData> // Explicit type assertion due to TypeScript's structural type system
  }
}

export const handleNull = (value: string | null | undefined): string | null => {
  return value && value.trim() !== '' ? value : null
}

/**
 * Generic date range validator utility.
 *
 * @param control - The form group to validate.
 * @param fieldPairs - An array of tuples where each tuple contains [fromField, toField] names.
 * @param errorKeys - (Optional) Custom error keys corresponding to each field pair.
 *
 * @returns A ValidationErrors object if any date range is invalid, or null if all are valid.
 */
export function dateRangeValidator(fieldPairs: [string, string][], errorKeys?: string[]) {
  return (control: AbstractControl): ValidationErrors | null => {
    const errors: ValidationErrors = {}

    fieldPairs.forEach(([fromKey, toKey], i) => {
      const fromValue = control.get(fromKey)?.value
      const toValue = control.get(toKey)?.value

      if (fromValue && toValue && fromValue > toValue) {
        const key = errorKeys?.[i] ?? `${fromKey}_${toKey}_invalid`
        errors[key] = true
      }
    })

    return Object.keys(errors).length > 0 ? errors : null
  }
}

export function removeNullableAndIgnoreKeys<T extends Record<string, unknown>>(
  obj: T,
  ignoredKeys?: (keyof T)[]
): Partial<T> {
  const result: Partial<T> = {}

  for (const key in obj) {
    const value = obj[key]

    if (ignoredKeys?.length && ignoredKeys?.some(el => el === key)) continue
    if (value !== null && value !== undefined) {
      result[key] = value
    }
  }

  return result
}
