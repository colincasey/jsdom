// https://html.spec.whatwg.org/multipage/nav-history-apis.html#the-beforeunloadevent-interface
[Exposed=Window]
interface BeforeUnloadEvent : Event {
  attribute DOMString returnValue;
};
