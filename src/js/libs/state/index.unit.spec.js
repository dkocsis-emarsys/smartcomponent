import State from './index.js';

describe('State', () => {
  describe('.get([name])', () => {
    context('calling without name', () => {
      it('returns with empty object', () => {
        const state = new State();

        expect(state.get()).to.deep.equal({});
      });

      it('returns with default data given in constructor', () => {
        const defaultData = { a: 1, b: 2 };
        const state = new State(defaultData);

        expect(state.get()).to.deep.equal(defaultData);
      });
    });

    context('calling with name', () => {
      it('returns with the value from default data given in constructor', () => {
        const defaultData = { a: 1, b: 2 };
        const state = new State(defaultData);

        expect(state.get('a')).to.equal(1);
      });

      it('contains "." returns with the value from default data given in constructor', () => {
        const defaultData = {
          a: {
            b: 2
          }
        };
        const state = new State(defaultData);

        expect(state.get('a')).to.deep.equal({ b: 2 });
      });

      it('contains "." returns with the value from default data given in constructor', () => {
        const defaultData = {
          a: {
            b: 2
          }
        };
        const state = new State(defaultData);

        expect(state.get('a.b')).to.equal(2);
      });
    });
  });

  describe('.set(name, value, [options])', () => {
    context('calling without options', () => {
      it('sets simple data according to parameters', () => {
        const state = new State();

        state.set('a', 1);

        expect(state.get('a')).to.equal(1);
      });

      it('sets deep data according to parameters', () => {
        const state = new State();

        state.set('a.b', { c: 3, d: 4 });

        expect(state.get('a')).to.deep.equal({ b: { c: 3, d: 4 } });
      });

      it('returns the value', () => {
        const state = new State();

        const result = state.set('a.b', { c: 3, d: 4 });

        expect(result).to.deep.equal({
          name: 'a.b',
          value: { c: 3, d: 4 }
        });
      });

      it('calls render function', () => {
        const renderSpy = sinon.spy();
        const state = new State({}, renderSpy);

        state.set('a', 1);

        expect(renderSpy).to.have.been.calledOnce;
      });

      it('does not call render function if value has not changed but returns the value', () => {
        const renderSpy = sinon.spy();
        const state = new State({}, renderSpy);

        state.set('a', 1);
        const result = state.set('a', 1);

        expect(renderSpy).to.have.been.calledOnce;
        expect(result).to.equal(1);
      });
    });

    context('calling with options', () => {
      it('does not call render function when triggerRender set to false', () => {
        const renderSpy = sinon.spy();
        const state = new State({}, renderSpy);

        state.set('a', 1, { triggerRender: false });

        expect(renderSpy).not.to.have.been.called;
      });

      it('does not call subscribe function when triggerCallback set to false', () => {
        const subscribeSpy = sinon.spy();

        const state = new State({});
        state.subscribe('a', subscribeSpy);
        state.set('a', 1, { triggerCallback: false });

        expect(subscribeSpy).not.to.have.been.called;
      });
    });
  });

  describe('.setMultiple(list, options = {})', () => {
    context('calling without options', () => {
      it('sets multiple simple data according to parameters', () => {
        const state = new State();

        state.setMultiple({ a: 1, b: 2 });

        expect(state.get('a')).to.equal(1);
        expect(state.get('b')).to.equal(2);
      });

      it('sets multiple deep data according to parameters', () => {
        const state = new State();

        state.setMultiple({ a: { c: 3 }, b: { d: 4 } });

        expect(state.get('a.c')).to.equal(3);
        expect(state.get('b.d')).to.equal(4);
      });

      it('returns the value', () => {
        const state = new State();

        const result = state.setMultiple({ a: 1, b: 2 });

        expect(result).to.deep.equal([
          { name: 'a', value: 1 },
          { name: 'b', value: 2 },
        ]);
      });

      it('calls render function', () => {
        const renderSpy = sinon.spy();
        const state = new State({}, renderSpy);

        state.setMultiple({ a: 1, b: 2 });

        expect(renderSpy).to.have.been.calledOnce;
      });
    });

    context('calling with options', () => {
      it('does not call render function when triggerRender set to false', () => {
        const renderSpy = sinon.spy();
        const state = new State({}, renderSpy);

        state.setMultiple({ a: 1, b: 2 }, { triggerRender: false });

        expect(renderSpy).not.to.have.been.called;
      });
    });
  });

  describe('.render()', () => {
    it('calls render function', () => {
      const renderSpy = sinon.spy();
      const state = new State({}, renderSpy);

      state.render();

      expect(renderSpy).to.have.been.calledOnce;
    });
  });

  describe('.subscribe(name, callback)', () => {
    it('calls callback function with value and name', () => {
      const subscribeSpy = sinon.spy();
      const state = new State({});

      state.subscribe('a', subscribeSpy);
      state.set('a', 1);

      expect(subscribeSpy).to.have.been.calledOnce;
      expect(subscribeSpy).to.have.been.calledWith(1, 'a');
    });

    it('name contains "." calls callback function with value and name', () => {
      const subscribeSpy = sinon.spy();
      const state = new State({});

      state.subscribe('a.b', subscribeSpy);
      state.set('a.b', 2);

      expect(subscribeSpy).to.have.been.calledOnce;
      expect(subscribeSpy).to.have.been.calledWith(2, 'a.b');
    });

    it('calls callback function with value and name for any changes occured in parent', () => {
      const subscribeSpy = sinon.spy();
      const state = new State({});

      state.subscribe('a', subscribeSpy);
      state.set('a', {});
      state.set('a.b', 2);

      expect(subscribeSpy).to.have.been.calledTwice;
      expect(subscribeSpy).to.have.been.calledWith(2, 'a.b');
    });

    it('does not trigger another call after unsubscribe', () => {
      const subscribeSpy = sinon.spy();
      const state = new State({});

      const subscription = state.subscribe('a', subscribeSpy);
      state.set('a', 1);
      subscription.unsubscribe();
      state.set('a', 2);

      expect(subscribeSpy).to.have.been.calledOnce;
    });

    it('triggering change manually calls callback function of unnamed subscriptions', () => {
      const subscribeSpy = sinon.spy();
      const state = new State({});

      state.set('a', 1);
      const subscription = state.subscribe(null, subscribeSpy);
      state.triggerChange('a');

      expect(subscribeSpy).to.have.been.calledOnce;
      expect(subscribeSpy).to.have.been.calledWith(1, 'a');
    });
  });

  describe('.unsubscribeAll(name)', () => {
    it('does not trigger another call', () => {
      const subscribeSpy = sinon.spy();
      const state = new State({});

      const subscription = state.subscribe('a', subscribeSpy);
      state.set('a', 1);
      state.unsubscribeAll('a');
      state.set('a', 2);

      expect(subscribeSpy).to.have.been.calledOnce;
    });

    it('does not trigger another call on the whole namespace', () => {
      const subscribeSpy = sinon.spy();
      const state = new State({});

      const subscription = state.subscribe('a', subscribeSpy);
      state.set('a', 1);
      state.unsubscribeAll('a');
      state.set('a.b', 2);

      expect(subscribeSpy).to.have.been.calledOnce;
    });
  });

describe('.triggerChange(name)', () => {
    it('triggers subscription callback', () => {
      const subscribeSpy = sinon.spy();
      const state = new State({});

      const subscription = state.subscribe('a', subscribeSpy);
      state.triggerChange('a');

      expect(subscribeSpy).to.have.been.calledOnce;
    });

    it('name contains "." triggers subscription callback', () => {
      const subscribeSpy = sinon.spy();
      const state = new State({});

      const subscription = state.subscribe('a', subscribeSpy);
      state.triggerChange('a.b');

      expect(subscribeSpy).to.have.been.calledOnce;
    });

    it('undefined name triggers callback on every subscription', () => {
      const subscribeSpy = sinon.spy();
      const state = new State({});

      const subscription = state.subscribe('a', subscribeSpy);
      state.triggerChange();

      expect(subscribeSpy).to.have.been.calledOnce;
    });
  });
});
