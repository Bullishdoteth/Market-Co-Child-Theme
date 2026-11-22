<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Enqueue Market & Co. styles and scripts.
 */
function marketco_enqueue_assets() {

    $theme_dir = get_stylesheet_directory();
    $theme_uri = get_stylesheet_directory_uri();

    // Main child theme stylesheet.
    wp_enqueue_style(
        'marketco-child-style',
        get_stylesheet_uri(),
        array( 'hello-elementor-theme-style' ),
        MARKETCO_VERSION
    );

    // Custom CSS files.
    $styles = array(
        'marketco-global'      => '/assets/css/global.css',
        'marketco-header'      => '/assets/css/header.css',
        'marketco-footer'      => '/assets/css/footer.css',
        'marketco-woocommerce' => '/assets/css/woocommerce.css',
        'marketco-help-center' => '/assets/css/help-center.css',
        'marketco-responsive'  => '/assets/css/responsive.css',
        'marketco-hero'        => '/assets/css/hero.css',
        'marketco-category-scroll' => '/assets/css/category-scroll.css',
        'marketco-age-gate'    => '/assets/css/age-gate.css',
        'marketco-menu-cart'   => '/assets/css/menu-cart.css',
        'marketco-fibosearch'  => '/assets/css/fiboSearch.css',
    );

    foreach ( $styles as $handle => $file ) {

        $path = $theme_dir . $file;

        if ( file_exists( $path ) ) {

            wp_enqueue_style(
                $handle,
                $theme_uri . $file,
                array( 'marketco-child-style' ),
                filemtime( $path )
            );
        }
    }

    // Custom JavaScript files.
    $scripts = array(
        'marketco-main'        => '/assets/js/main.js',
        'marketco-help-center' => '/assets/js/help-center.js',
        'marketco-woocommerce' => '/assets/js/woocommerce.js',
        'marketco-hero'        => '/assets/js/hero.js',
        'marketco-footer'      => '/assets/js/footer.js',
    );

    foreach ( $scripts as $handle => $file ) {

        $path = $theme_dir . $file;

        if ( file_exists( $path ) ) {

            wp_enqueue_script(
                $handle,
                $theme_uri . $file,
                array(),
                filemtime( $path ),
                true
            );
        }
    }

}

add_action( 'wp_enqueue_scripts', 'marketco_enqueue_assets', 30 );