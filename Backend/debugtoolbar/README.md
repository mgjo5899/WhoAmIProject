### [https://docs.pylonsproject.org/projects/pyramid/en/latest/quick_tutorial/debugtoolbar.html](https://docs.pylonsproject.org/projects/pyramid/en/latest/quick_tutorial/debugtoolbar.html)

The pyramid_debugtoolbar Python package is also a Pyramid add-on, which means we need to include its add-on configuration into our web application. We could do this with imperative configuration in tutorial/__init__.py by using config.include. Pyramid also supports wiring in add-on configuration via our development.ini using pyramid.includes. We use this to load the configuration for the debugtoolbar.
