export const addImagesToCodeBlocks = async codeBlocks => {
    const images = await Promise.all(
        Array.from({ length: 8 }, (_, index) =>
            import(`../assets/imgs/img-${index + 1}.png`).then(module => module.default)
        )
    )

    return codeBlocks.map((block, index) => ({
        ...block,
        image: images[index % images.length], // Cycles through images if there are more blocks than images.
    }))
}
