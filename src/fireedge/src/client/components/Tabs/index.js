import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'

import { Tabs as MTabs, Tab as MTab } from '@material-ui/core'

const Content = ({ name, renderContent: Content, hidden, data }) => (
  <div key={`tab-${name}`}
    style={{
      padding: 2,
      height: '100%',
      overflow: 'auto',
      display: hidden ? 'none' : 'block'
    }}
  >
    {typeof Content === 'function' ? <Content {...data} /> : Content}
  </div>
)

const Tabs = ({ tabs = [], renderHiddenTabs = false, data }) => {
  const [tabSelected, setTab] = useState(0)

  const renderTabs = useMemo(() => (
    <MTabs
      value={tabSelected}
      variant='scrollable'
      scrollButtons='auto'
      onChange={(_, tab) => setTab(tab)}
    >
      {tabs.map(({ value, name, icon: Icon }, idx) =>
        <MTab
          key={`tab-${name}`}
          id={`tab-${name}`}
          icon={Icon && <Icon />}
          value={value ?? idx}
          label={String(name).toUpperCase()}
        />
      )}
    </MTabs>
  ), [tabs.length, tabSelected])

  const renderAllHiddenTabContents = useMemo(() =>
    tabs.map((tabProps, idx) => {
      const { name, value = idx } = tabProps
      const hidden = tabSelected !== value

      return <Content key={`tab-${name}`} {...tabProps} hidden={hidden} />
    }), [tabSelected])

  return (
    <>
      {renderTabs}
      {renderHiddenTabs ? (
        renderAllHiddenTabContents
      ) : (
        <Content data={data} {...tabs.find(({ value }, idx) => (value ?? idx) === tabSelected)} />
      )}
    </>
  )
}

Tabs.displayName = 'Tabs'
Content.displayName = 'Content'

Tabs.propTypes = {
  tabs: PropTypes.array,
  renderHiddenTabs: PropTypes.bool,
  data: PropTypes.object
}

Content.propTypes = {
  name: PropTypes.string,
  renderContent: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func
  ]),
  hidden: PropTypes.bool,
  data: PropTypes.object
}

export default Tabs