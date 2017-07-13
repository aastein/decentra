import React from 'react';

import ChartHeader from './ChartHeader';
import Chart from './Chart';
import Scratchpad from './Scratchpad';
import Log from './Log';

const Dashboard = props => (
  (
    <div className="dashboard">
      <div className="top-container">
        <div className="left-conatiner">
          <ChartHeader
            chart={props.chart}
            selectedProductIds={props.profile.selectedProducts.map(p => (p.value))}
            websocket={props.websocket}
            selectProduct={props.selectProduct}
            setGanularity={props.setGranularity}
            setProductData={props.setProductData}
            selectIndicator={props.selectIndicator}
            editIndicator={props.editIndicator}
            selectDateRange={props.selectDateRange}
            setProducts={props.setProducts}
            setProductWSData={props.setProductWSData}
          />
          <div className="chart-container">
            <Chart
              chart={props.chart}
              scripts={props.scripts}
              profile={props.profile}
              appendLog={props.appendLog}
              updateAccounts={props.updateAccounts}
            />
            <div className="websocket-chart" />
          </div>
        </div>
        <div className="right-container">
          <Log log={props.log} />
        </div>
      </div>
      <Scratchpad
        className="bottom-container"
        scripts={props.scripts}
        products={props.chart.products}
        profile={props.profile}
        addScript={props.addScript}
        appendLog={props.appendLog}
        saveScript={props.saveScript}
        deleteScript={props.deleteScript}
        saveTestResult={props.saveTestResult}
        selectScript={props.selectScript}
        selectProductDoc={props.selectProductDoc}
        toggleScriptLive={props.toggleScriptLive}
        updateAccounts={props.updateAccounts}
      />
    </div>
  )
);

export default Dashboard;
