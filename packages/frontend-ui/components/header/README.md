# Header

In order to remove the linking capability of the header logo and text include the `isEmbeddedMobileApp = true` variable within your repos basefile when you are calling the header

{% block header %}
  {{ frontendUiHeader
  ({
    isEmbeddedMobileApp = true
  })
  }}
{% endblock %}
