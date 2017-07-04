import { connect } from 'react-redux'

import { setProducts,
  setProduct,
  setProductData,
  setProductWSData,
  setDateRange,
  addScript,
  saveScript,
  deleteScript,
  initDocs,
  selectScript,
  selectDoc
} from '../../actions'

import Dashboard from './components/Dashboard'

const mapStateToProps = state => {
  return {
    chart: state.chart,
    products: state.products,
    scripts: state.scripts,
    docs: state.docs
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setProducts: products => {
      dispatch(setProducts(products))
    },
    setProductData: (id, data) => {
      dispatch(setProductData(id, data))
    },
    setProductWSData: (id, ws_data) => {
        dispatch(setProductWSData(id, ws_data))
    },
    onSelect: product => {
      dispatch(setProduct(product))
    },
    onApply: (startDate, endDate) => {
      dispatch(setDateRange(startDate, endDate))
    },
    onAdd: () => {
      dispatch(addScript())
    },
    onSave: script => {
      dispatch(saveScript(script))
    },
    onDelete: id => {
      dispatch(deleteScript(id))
    },
    initDocs: () => {
      dispatch(initDocs())
    },
    onScriptClick: id => {
      dispatch(selectScript(id))
    },
    onDocClick: name => {
      dispatch(selectDoc(name))
    }
  }
}

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)

export default DashboardContainer