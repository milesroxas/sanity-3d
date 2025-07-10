export const linkQuery = `
    _key,
    ...,
    "href": select(
      isExternal => href,
      @.internalLink->slug.current == "index" => "/",
      @.internalLink->_type == "post" => "/blog/" + @.internalLink->slug.current,
      "/" + @.internalLink->slug.current
    )
`;
