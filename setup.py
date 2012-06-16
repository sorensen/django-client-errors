#!/usr/bin/env python

# Use setuptools if we can
try:
    from setuptools.core import setup
except ImportError:
    from distutils.core import setup
from client_errors import __version__

setup(
    name='django-client-errors',
    version=__version__,
    description='Automatic javascript error tracking with browser and device information.',
    long_description=open('README.md').read(),
    author='Beau Sorensen',
    author_email='mail@beausorensen.com',
    url='https://github.com/sorensen/django-client-errors',
    download_url='https://github.com/sorensen/django-client-errors/downloads',
    license='MIT',
    packages=[
        'client_errors'
    ],
    tests_require=[
        'django>=1.3,<1.5',
    ],
    # test_suite='runtests.runtests',
    include_package_data=True,
    zip_safe=False,  # because we're including media that Django needs
    classifiers=[
        'Development Status :: 4 - Beta',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Python Modules',
    ],
)
