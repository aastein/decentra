import React, { Component } from 'react';
import { ObjectInspector } from 'react-inspector';
import ToggleSwitch from 'react-toggle-switch';

import { run } from '../../../utils/scriptEnv';
import { test } from '../../../utils/scriptTestEnv';
import { getAccounts } from '../../../utils/api';

const ScriptList = ({ addNew, scripts, onScriptClick, toggleScriptLive }) => (
  <div className="script-list list-group col-md-3">
    <div>
      <button
        className="list-group-item list-group-item-action btn-primary"
        key="add-new"
        onClick={() => addNew()}
      >
        Add New
      </button>
    </div>
    <div className="scripts">
      { scripts.map(script => (
        <div key={script.id} className={`list-group-item ${script.active ? 'active' : ''}`}>
          <button
           // className={`list-group-item list-group-item-action ${script.active ? ' active' : ''}`}
            className="script-button"
            onClick={() => onScriptClick(script.id)}
          >
            {script.name}
          </button>
          <ToggleSwitch
            on={script.live}
            onClick={() => toggleScriptLive(script.id)}
          />
        </div>
      ))}
    </div>
  </div>
);

const ProductDataList = ({ products, onClick }) => (
  <div className="doc-list list-group col-md-3">
    <div>
      <h3>
        Product Data
      </h3>
    </div>
    <div className="docs">
      { products.map(p => (
        <div key={p.id}>
          <button
            className="list-group-item list-group-item-action"
            onClick={() => onClick(p.id)}
          >
            {p.id.replace('-', '_')}
          </button>
          { p.docSelected &&
            <div className="doc-desc">
              <ObjectInspector data={p} name={p.display_name} />
            </div>
          }
        </div>
      ))}
    </div>
  </div>
);

class CodeEditor extends Component {

  handleTextAreaChange = (event) => {
    const script = { ...this.props.script, script: event.target.value };
    this.props.saveScript(script);
  }

  handleInputChange = (event) => {
    const name = event.target.value;
    this.props.saveScript({ ...this.props.script, name });
  }

  updateAccounts = () => {
    if (this.props.profile.session.length > 5) {
      setTimeout(() => {
        getAccounts(this.props.profile.session).then((res) => {
          this.props.updateAccounts(res);
        });
      }, 5000);
    }
  }

  runScript = (event) => {
    event.preventDefault();
    run(this.props.script.script, this.props.products, this.props.profile, this.props.appendLog,
      this.updateAccounts);
  }

  testScript = (event) => {
    event.preventDefault();
    const result = test(this.props.script.script, this.props.products, this.props.appendLog);
    this.props.saveTestResult(result);
  }

  render() {
    return (
      <div className="code-editor col-md-6">
        <form onSubmit={this.handleSave}>
          <div className="editor-form row">
            <div className="name-group">
              <div className="input-group">
                <div className="input-group-addon">Script Name:</div>
                <input
                  className="form-control"
                  type="input"
                  value={this.props.script.name}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
            <div className="save-input">
              <input
                className="btn btn-danger"
                type="button"
                value="Delete"
                onClick={this.props.deleteScript}
              />
            </div>
          </div>
          <textarea
            className="form-group col-md-12"
            rows={'3'}
            cols={'30'}
            value={this.props.script.script}
            onChange={this.handleTextAreaChange}
          />
          <div className="run-button">
            <button className="btn btn-success btn-run" onClick={this.runScript}>Run</button>
          </div>
          <div className="test-button">
            <button className="btn btn-warning btn-test" onClick={this.testScript}>Test</button>
          </div>
        </form>
      </div>
    );
  }
}

const Scratchpad = (props) => {
  const activeScript = props.scripts.reduce((a, b) => (
    b.active ? b : a
  ), {});

  return (
    <div>
      <ScriptList
        scripts={props.scripts}

        addNew={props.addScript}
        toggleScriptLive={props.toggleScriptLive}
        onScriptClick={props.selectScript}
      />
      <CodeEditor
        products={props.products}
        profile={props.profile}
        script={activeScript}

        appendLog={props.appendLog}
        deleteScript={props.deleteScript}
        saveScript={props.saveScript}
        saveTestResult={props.saveTestResult}
        updateAccounts={props.updateAccounts}
      />
      <ProductDataList products={props.products} onClick={props.selectProductDoc} />
    </div>
  );
};

export default Scratchpad;