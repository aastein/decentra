import React, { Component } from 'react';
import { connect } from 'react-redux';

import { placeLimitOrder } from '../../actions/thunks'
import { floor } from '../../math';

import * as selectors from '../../selectors';

class ManualOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderType: {
        market: true,
        limit: false,
      },
      side: {
        buy: true,
        sell: false,
      },
      appOrderType: {
        manual: true,
        bestPrice: false,
        activeBestPrice: false,
      },
      postOnly: true,
      amount: 0,
      price: 0,
    };
  }

  // only update when state changed because user input
  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.nextState) !== JSON.stringify(nextState);
  }

  handleInputChange(event, key) {
    let value = event.target.value;
    if (key === 'amount') {
      value = floor(value, 8);
    } else if (key === 'price'){
      value = floor(value, 2);
    }
    const state = this.state;
    state[key] = value;
    this.setState(() => ({ ...state }));
  }

  // make key in parent in state true, else false
  handleClick(event, parent, key) {
    event.preventDefault();
    const keyValues = Object.keys(this.state[parent]).reduce((kvs, k)=> {
      const o = {};
      o[k] = k === key;
      return { ...kvs, ...o };
    }, {});
    const state = { ...this.state };
    state[parent] = keyValues;
    this.setState(() => ({ ...state }));
  }

  handleOrder(event) {
    event.preventDefault();
    const appOrderType = Object.keys(this.state.appOrderType).find(k => {
      return this.state.appOrderType[k];
    });
    const orderType = Object.keys(this.state.orderType).find(k => {
      return this.state.orderType[k];
    });
    const side = Object.keys(this.state.side).find(k => {
      return this.state.side[k];
    });
    if (orderType === 'limit') {
      console.log('placing limit order:', orderType, appOrderType, side, this.props.selectedProductId, this.state.price, this.state.amount);
      this.props.placeLimitOrder(appOrderType, side, this.props.selectedProductId, this.state.price, this.state.amount)
    }
    if (orderType === 'market' ) {

    }
  }

  totalPrice() {
    const amount = this.state.amount;
    let price;
    if(this.state.orderType.limit) {
      if (this.state.appOrderType.manual) {
        price = this.state.price;
      } else if (this.state.appOrderType.bestPrice || this.state.appOrderType.activeBestPrice) {
         if (this.state.side.buy) {
          price = this.props.bid;
        } else if (this.state.side.sell) {
          price = this.props.ask;
        }
      }
    } else if (this.state.orderType.market) {
      if (this.state.side.buy) {
        price = this.props.ask;
      } else if (this.state.side.sell) {
        price = this.props.bid;
      }
    }
    return floor((amount * price), 2);
  }

  amountToMax(event) {
    event.preventDefault();
    let value;
    if (this.state.side.sell) {
      // if sell, sell all BTC
      value = this.props.amountBaseCurrency;
    } else if (this.state.side.buy) {
      // if buy, but max BTC with USD at price == best bid = 8000 usd / btc
      value = Number(this.props.amountQuoteCurrency) / Number(this.props.bid);
    }
    value = floor(value, 8);
    const state = { ...this.state };
    state['amount'] = value;
    this.setState(() => ({ ...state }));
  }

  render() {
    // console.log('rendering manual order');
    return ( this.props.visible &&
      <div className="container secondary-bg-dark p-2 flex-1">
        <div className="columns px-1">
          <button onClick={(e) => {this.handleClick(e, 'orderType', 'market')}} className={`col-6 btn order ${this.state.orderType.market ? '' : 'text-gray bg-dark'}`}>Market</button>
          <button onClick={(e) => {this.handleClick(e, 'orderType', 'limit')}} className={`col-6 btn order ${this.state.orderType.limit ? '' : 'text-gray bg-dark'}`}>Limit</button>
        </div>
        <div className="columns px-1">
          <button onClick={(e) => {this.handleClick(e, 'side', 'buy')}} className={`col-6 btn buy ${this.state.side.buy ? 'bg-green' : 'text-gray bg-dark'}`}>Buy</button>
          <button onClick={(e) => {this.handleClick(e, 'side', 'sell')}} className={`col-6 btn sell ${this.state.side.sell ? 'bg-red' : 'text-gray bg-dark'}`}>Sell</button>
        </div>
        {
          this.state.orderType.limit &&
          <div className="columns px-1">
            <button onClick={(e) => {this.handleClick(e, 'appOrderType', 'manual')}} className={`col-4 btn order ${this.state.appOrderType.manual ? '' : 'text-gray bg-dark'}`}>Manual</button>
            <button onClick={(e) => {this.handleClick(e, 'appOrderType', 'bestPrice')}} className={`col-4 btn order ${this.state.appOrderType.bestPrice ? '' : 'text-gray bg-dark'}`}>Best Price</button>
            <button onClick={(e) => {this.handleClick(e, 'appOrderType', 'activeBestPrice')}} className={`col-4 btn order ${this.state.appOrderType.activeBestPrice ? '' : 'text-gray bg-dark'}`}>Active Best Price</button>
          </div>
        }
        <div className="form-group">
          <div className="columns px-1">
            <label className="form-label text-light">{`Amount ${this.props.baseCurrency}`}</label>
            <button className="btn btn-order btn-nofocus m-2" onClick={(e) => {this.amountToMax(e)}}>Max</button>
          </div>
          <input step="any" value={this.state.amount} type="number" onChange={(e) => {this.handleInputChange(e, 'amount')}} className="form-input"/>
        </div>
        { this.state.orderType.limit && this.state.appOrderType.manual &&
          <div className="form-group">
            <label className="form-label text-light">Price $</label>
            <input step="any" value={this.state.price} type="number" onChange={(e) => {this.handleInputChange(e, 'price')}} className="form-input"/>
          </div>
        }
        { this.state.orderType.limit && (this.state.appOrderType.bestPrice || this.state.appOrderType.activeBestPrice) &&
          <div className="form-group">
            <label className="form-label text-light">{`Price $${this.state.side.buy ? this.props.bid : this.props.ask}`}</label>
          </div>
        }
        <div className="form-group">
          <label className="form-label text-light">{`Total $${this.totalPrice()}`}</label>
        </div>
        <div className="columns px-1">
          <button onClick={(e) => {this.handleOrder(e)}} className="col-6 col-mx-auto btn">Place Order</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const content = 'Trade';
  const visible = state.view.bottomRight.find(c => (c.id === content)).selected;
  const selectedExchange = selectors.selectedExchange(state);
  const selectedProduct = selectors.selectedProduct(selectedExchange);
  const selectedProductData = selectors.productData(selectedProduct)
  const selectedProductId = selectors.productId(selectedProduct);
  let bid = '';
  let ask = '';
  let baseCurrency = '';
  let quoteCurrency = '';
  let amountQuoteCurrency = 0;
  let amountBaseCurrency = 0;
  if (selectedProductData.base_currency) {
    const ticker = selectors.ticker(selectedProduct);
    bid = ticker.bestBid ? ticker.bestBid : bid;
    ask = ticker.bestAsk ? ticker.bestAsk : ask;
    baseCurrency = selectedProductData.base_currency;
    quoteCurrency = selectedProductData.quote_currency;
    const baseAccount = selectors.currencyAccount(selectedExchange, baseCurrency);
    amountBaseCurrency = baseAccount ? baseAccount.available : amountQuoteCurrency;
    const quoteAccount = selectors.currencyAccount(selectedExchange, quoteCurrency);
    amountQuoteCurrency = quoteAccount ? quoteAccount.available: amountQuoteCurrency;
  }

  return ({
    selectedProductId,
    content,
    visible,
    ask,
    bid,
    baseCurrency,
    quoteCurrency,
    amountQuoteCurrency,
    amountBaseCurrency,
  })
};

const mapDispatchToProps = dispatch => (
  {
    placeLimitOrder: (appOrderType, side, productId, price, size) => {
      dispatch(placeLimitOrder(appOrderType, side, productId, price, size));
    },
  }
);

const ManualOrderContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManualOrder);

export default ManualOrderContainer;
