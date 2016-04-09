import Backbone from 'backbone';


export default {
  initBackboneState(url=false, model=Backbone.Model) {
    this[this.stateName] = {
      isLoaded: false,
      item: new model()
    };
    if (url) {
      this[this.stateName].item.url = url;
    }
    let returnObj = {};
    returnObj[this.stateName] = this[this.stateName];

    return returnObj;

  },

  reset() {
    this[this.stateName].isLoaded = false;
    this[this.stateName].item.clear();
  },

  changeUrl(url) {
    this[this.stateName].item.url = url;
  },

  fetch(data) {
    if (this.loadCount === undefined) {
      this.loadCount = 0;
    }
    this.loadCount += 1;
    this[this.stateName].item.fetch(
      {
        type: 'POST',
        data: JSON.stringify(data),
        success: (collection, response) => {
          if (this.loadCount === 1) {
            this.listenables.load.completed(collection, response);
          }
          this.loadCount -= 1;
        },
        error: (collection, response) => {
          if (this.loadCount === 1) {
            this.onLoadFailed(response);
          }
          this.loadCount -= 1;
          // This bug should be fixed in new version
          // https://github.com/spoike/refluxjs/issues/296
          // Actions.load.failed(response);
        }
      }
    );
  },

  save(data, clear=false) {
    if (clear) {
      this[this.stateName].item.clear();
    }
    this[this.stateName].item.set(data);
    this[this.stateName].item.save(
      null,
      {
        wait: true,
        success: (m, response) => {
          this.completed(response);
          this.listenables[this.actionMethodName].completed(m, response);
        },
        error: (m, response) => {
          this.failed(response);
          this.listenables[this.actionMethodName].failed(m, response);
        }
      }
    );
  },

  failed(response) {
    let responseJSON = response.responseJSON;
    this[this.stateName].isSuccess = false;
    this[this.stateName].isLoaded = true;
    if (responseJSON && responseJSON.error) {
      this[this.stateName].errorMsg = responseJSON.error;
    } else {
      this[this.stateName].errorMsg = 'Unknown error';
    }
  },

  completed(collection, response) {
    this[this.stateName].isSuccess = true;
    this[this.stateName].isLoaded = true;
  },

  update(action=false, data=this[this.stateName]) {
    let response = {action};
    response[this.stateName] = this[this.stateName];
    this.trigger(response);
  }
};
