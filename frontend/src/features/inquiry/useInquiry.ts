import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'

export function useInquiry(facility: boolean) {
  const { i18n } = useTranslation()
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [product, setProduct] = useState('')
  const [pending, setPending] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const [website, setWebsite] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [verificationResetKey, setVerificationResetKey] = useState(0)

  function validate() {
    if (facility) {
      if (!name.trim()) return 'company.form.nameRequired'
      if (!subject.trim()) return 'company.form.subjectRequired'
    } else if (!firstName.trim() || !lastName.trim()) return 'quote.errors.nameRequired'
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'quote.errors.emailInvalid'
    if (!phone.trim()) return 'quote.errors.phoneRequired'
    if (!(facility ? /^[+\d][\d ()-]{6,24}$/ : /^\d{10}$/).test(phone))
      return 'quote.errors.phoneInvalid'
    if (!facility && !city.trim()) return 'quote.errors.cityRequired'
    if (!facility && !product) return 'quote.errors.productRequired'
    return null
  }

  async function handleSubmit(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault()
    if (pending) return
    setSubmitted(false)
    setCopyFailed(false)
    const err = validate()
    if (err) {
      setError(err)
      return
    }
    if (!turnstileToken) {
      setError('verification.required')
      return
    }

    const parseResponseBody = async (response: Response) => {
      const contentType = response.headers.get('content-type') || ''

      if (contentType.includes('application/json')) {
        try {
          return await response.json()
        } catch {
          return null
        }
      }

      try {
        const text = await response.text()
        return text ? { error: text } : null
      } catch {
        return null
      }
    }

    setPending(true)
    setError(null)
    try {
      const response = await fetch('/.netlify/functions/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kind: facility ? 'facility' : 'screen',
          website,
          turnstileToken,
          ...(facility ? { name, subject } : { firstName, lastName, city, product }),
          email,
          phone,
          message,
          locale: i18n.language,
        }),
      })

      if (!response.ok) {
        const errorData = await parseResponseBody(response)
        const code = errorData?.code
        const key =
          response.status === 429
            ? 'rateLimited'
            : response.status === 413
              ? 'tooLarge'
              : code === 'INVALID_INPUT'
                ? 'invalid'
                : code === 'UNAVAILABLE'
                  ? 'unavailable'
                  : 'submitFailed'
        setError(
          code === 'VERIFICATION_REQUIRED'
            ? 'verification.required'
            : code === 'VERIFICATION_UNAVAILABLE'
              ? 'verification.unavailable'
              : `quoteErrors.${key}`,
        )
        return
      }

      const result = await parseResponseBody(response)
      if (result?.success !== true) {
        setError('quoteErrors.submitFailed')
        return
      }
      setCopyFailed(result.confirmationSent === false)
      setSubmitted(true)
      setError(null)
      // Reset form after successful submission
      setName('')
      setSubject('')
      setFirstName('')
      setLastName('')
      setEmail('')
      setPhone('')
      setCity('')
      setProduct('')
      setMessage('')
    } catch (err) {
      setError('quote.errors.submitFailed')
      console.error('Quote submission failed', err instanceof Error ? err.name : 'UnknownError')
    } finally {
      setPending(false)
      setTurnstileToken('')
      setVerificationResetKey((key) => key + 1)
    }
  }

  function reset() {
    setTurnstileToken('')
    setVerificationResetKey((key) => key + 1)
    setName('')
    setSubject('')
    setFirstName('')
    setLastName('')
    setEmail('')
    setPhone('')
    setCity('')
    setProduct('')
    setMessage('')
    setWebsite('')
    setError(null)
    setSubmitted(false)
    setCopyFailed(false)
  }

  return {
    turnstileToken,
    setTurnstileToken,
    verificationResetKey,
    name,
    setName,
    subject,
    setSubject,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    phone,
    setPhone,
    city,
    setCity,
    product,
    setProduct,
    message,
    setMessage,
    website,
    setWebsite,
    pending,
    submitted,
    copyFailed,
    error,
    handleSubmit,
    reset,
  }
}
