/*
 * Copyright Jiaqi Liu
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'

import FeatureToggle from './FeatureToggle'
import { FeatureToggleProvider } from './FeatureToggleProvider'

const On = () => {
  return <h1>Yes</h1>
}
const Off = () => {
  return <h1>No</h1>
}

type ErrorBState = any

class ErrorB extends React.Component<{}, ErrorBState> {
  state = {
    error: ''
  }

  componentDidCatch(e: any) {
    this.setState({ error: e })
  }

  render() {
    if (!this.state.error) {
      return this.props.children
    }
    return <span data-testid="error">{this.state.error.toString()}</span>
  }
}

describe('FeatureToggle', () => {
  test('shows features when theres no context provider available', () => {
    render(<FeatureToggle name="testFeature" on={<On />} off={<Off />} />)

    // Then
    expect(screen.getByText('Yes')).not.toBeUndefined()
    expect(screen.queryByText('No')).toBeNull()
  })
  test('shows "on" features when context says so', () => {
    // Given
    const features = { testFeature: { on: true } }

    render(
      <FeatureToggleProvider features={features}>
        <FeatureToggle name="testFeature" on={<On />} off={<Off />} />
      </FeatureToggleProvider>
    )

    // Then
    expect(screen.getByText('Yes')).not.toBeUndefined()
    expect(screen.queryByText('No')).toBeNull()
  })
  test('shows "off" features when context says so', () => {
    // Given
    const features = { testFeature: { on: false } }

    render(
      <FeatureToggleProvider features={features}>
        <FeatureToggle name="testFeature" on={<On />} off={<Off />} />
      </FeatureToggleProvider>
    )

    // Then
    expect(screen.getByText('No')).not.toBeUndefined()
    expect(screen.queryByText('Yes')).toBeNull()
  })
  test('returns null if no "off" prop is availavle', () => {
    // Given
    const features = { testFeature: { on: false } }

    render(
      <FeatureToggleProvider features={features}>
        <FeatureToggle name="testFeature" on={<On />} />
      </FeatureToggleProvider>
    )
    // Then

    expect(screen.queryByText('Yes')).toBeNull()
    expect(screen.queryByText('No')).toBeNull()
  })
  test('throws if no "on" prop is available but the feature is to be shown', async () => {
    // Given
    const oldConsoleError = console.error
    console.error = () => {}

    const features = { testFeature: { on: true } }

    // When
    render(
      <ErrorB>
        <FeatureToggleProvider features={features}>
          <FeatureToggle name="testFeature" off={<Off />} />
        </FeatureToggleProvider>
      </ErrorB>
    )

    // Wait for error propagation
    await waitFor(() => screen.getByTestId('error'))

    // Then
    expect(screen.getByTestId('error')).toHaveTextContent(
      'No "on" property available for this enabled feature: testFeature for FeatureToggle component.'
    )

    console.error = oldConsoleError
  })
  test('throws if no "name" property provided', async () => {
    // Given
    const oldConsoleError = console.error
    console.error = () => {}

    const features = { testFeature: { on: true } }

    // When
    render(
      <ErrorB>
        <FeatureToggleProvider features={features}>
          <FeatureToggle on={<On />} off={<Off />} />
        </FeatureToggleProvider>
      </ErrorB>
    )

    // Wait for error propagation
    await waitFor(() => screen.getByTestId('error'))

    // Then
    expect(screen.getByTestId('error')).toHaveTextContent(
      'No "name" property provided to FeatureToggle component.'
    )

    console.error = oldConsoleError
  })
})
