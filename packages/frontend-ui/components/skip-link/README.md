# Skip Link

## Translations

For translations to be enabled, the param `skipLink: translations` should be passed into `frontendUiSkipLink` in the `skipLink` block.

```html
{% block skipLink %} {{ frontendUiSkipLink({ skipLink: translations }) }} {%
endblock %}
```
