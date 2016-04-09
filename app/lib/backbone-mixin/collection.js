import Backbone from 'backbone';


export default {
  initBackboneState(url=false, collection=Backbone.Collection) {
    this[this.stateName] = {
      isLoaded: false,
      items: new collection()
    };
    if (url) {
      this[this.stateName].items.url = url;
    }
    let returnObj = {};
    returnObj[this.stateName] = this[this.stateName];

    return returnObj;

  },

  reset() {
    this[this.stateName].isLoaded = false;
    this[this.stateName].items.reset();
  },

  changeUrl(url) {
    this[this.stateName].items.url = url;
  },

  fetch(data = {}, remove = true) {
    if (this.loadCount === undefined) {
      this.loadCount = 0;
    }
    this.loadCount += 1;
    let myCountNumber = this.loadCount;

    this[this.stateName].items.fetch(
      {
        remove: remove,
        type: 'POST',
        data: JSON.stringify(data),
        success: (collection, response) => {
          if (myCountNumber === this.loadCount) {
            this.listenables.load.completed(collection, response);
          }
        },
        error: (collection, response) => {
          if (myCountNumber === this.loadCount) {
            this.listenables.load.failure(response);
          }
        }
      }
    );
  },

  failureLoad(response) {
    let responseJSON = response.responseJSON;

    this[this.stateName].isSuccess = false;
    this[this.stateName].isLoaded = true;
    if (responseJSON && responseJSON.error) {
      this[this.stateName].errorMsg = responseJSON.error;
    } else {
      this[this.stateName].errorMsg = 'Unknown error';
    }
  },

  completedLoad(collection, response) {
    this[this.stateName].isSuccess = true;
    this[this.stateName].isLoaded = true;
  },

  delete(model, backendDelete) {
    if (backendDelete) {
      model.destroy(
        {
          wait: true,
          success: (m, response) => {
            this.listenables.delete.completed(m, response);
          },
          error: (m, response) => {
            this.listenables.delete.failure(m, response);
          }
        }
      );
    } else {
      this[this.stateName].items.remove(model);
      this.listenables.delete.completed();
    }
  },

  failureDelete(model, response) {
    let responseJSON = response.responseJSON;

    model.hasError = true;
    if (responseJSON && responseJSON.error) {
      model.errorMsg = responseJSON.error;
    } else {
      model.errorMsg = 'Unknown error';
    }
  },

  save(model, data, params={}, extra_args={}) {
    model.set(data);
    if (model.isNew()) {
      model.url = this[this.stateName].items.url;
    }

    model.save(
      null,
      {
        patch: params.patch || false,
        wait: true,
        success: (m, response) => {
          this.listenables.save.completed(m, response);
        },
        error: (m, response) => {
          this.listenables.save.failure(m, response);
        }
      }
    );
  },

  completedSave(model, response, addToEnd) {
    model.hasError = false;
    model.errorMsg = null;
    if (addToEnd) {
      this[this.stateName].items.add(model);
    } else {
      this[this.stateName].items.unshift(model);
    }
  },

  failureSave(model, response) {
    let responseJSON = response.responseJSON;

    model.hasError = true;
    if (responseJSON && responseJSON.error) {
      model.errorMsg = responseJSON.error;
    } else {
      model.errorMsg = 'Unknown error';
    }
  },

  getNewItem() {
    return new Backbone.Model();
  }

};
