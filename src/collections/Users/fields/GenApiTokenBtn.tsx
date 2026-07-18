'use client'
import React from 'react'
import { Button, useDocumentInfo } from '@payloadcms/ui'

export const GenApiTokenBtn: React.FC = () => {
  // Optional: Fetch info about the current user document if editing an existing one
  const { id } = useDocumentInfo()

  const handleClick = async () => {
    if (!id) {
      alert('Please save the user first before running this action.')
      return
    }

    try {
      // Example: Triggering a custom API endpoint or webhook
      const response = await fetch(`/api/users/gen-api-token`, {
        method: 'POST',
      })

      if (response.ok) {
        // alert('Action executed successfully!')
        const data = await response.json().catch(_ => null);
        data && window.prompt('success', JSON.stringify(data))
      } else {
        alert('Something went wrong.')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <Button
        type="button"
        buttonStyle="secondary"
        onClick={handleClick}
      >
        Trigger Custom Action
      </Button>
    </div>
  )
}



export default React.memo(GenApiTokenBtn)