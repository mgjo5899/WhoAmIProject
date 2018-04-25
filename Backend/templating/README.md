### [https://docs.pylonsproject.org/projects/pyramid/en/latest/quick_tutorial/templating.html](https://docs.pylonsproject.org/projects/pyramid/en/latest/quick_tutorial/templating.html)

- We have a view that is focused on Python code. Our @view_config decorator specifies a renderer that points to our template file. Our view then simply returns data which is then supplied to our template. Note that we used the same template for both views.
- Note the effect on testing. We can focus on having a data-oriented contract with our view code.
