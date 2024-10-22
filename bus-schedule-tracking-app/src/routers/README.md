# About the routers

New components must be **standalone** to be added to the router map. 

Step 1:

**RouterMap.jsx**

Add a `{path, element}` to the `children` of the **BrowserRouter**.

Step 2:

**RootIndex.jsx**

Add a navigation menu to the component. Follow the pattern in the menu.

```
# In NavDropdown

<NavDropdown>
  ...
  <NavDropdown.Item as={Link} to="/route-to-new-component">
    Name you want to give to the menu
  </NavDropdown.Item>

<NavDropdown>
```

Step 3:

Add a Button Link to the home page.

```
# In the HomePage.jsx
# Add the Button Link

<Button as={Link} to="/route-to-new-component">
  Name you want to give to the menu
</Button>

```